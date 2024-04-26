//获取WeChatAppEx.exe的基址
//var  version
version = +version;
var base = Process.findModuleByName("WeChatAppEx.exe").base
for (let key in infos.address) {
    infos.address[key] = base.add(infos.address[key]);
}
var address = infos.address;
var data = infos.data;


function readStdString(s) {
    var flag = s.add(23).readU8()
    if (flag == 0x80) {
        // 从堆中读取
        var size = s.add(8).readUInt()
        return s.readPointer().readUtf8String(size)
    } else {
        // 从栈中读取
        return s.readUtf8String(flag)
    }
}
function writeStdString(s, content) {
    var flag = s.add(23).readU8()
    if (flag == 0x80) {
        // 从堆中写入
        var orisize = s.add(8).readUInt()
        if (content.length > orisize) {
            throw "must below orisize!"
        }
        s.readPointer().writeUtf8String(content)
        s.add(8).writeUInt(content.length)
    } else {
        // 从栈中写入
        if (content.length > 22) {
            throw "max 23 for stack str"
        }
        s.writeUtf8String(content)
        s.add(23).writeU8(content.length)
    }
}
//整数 到 字节数组  小端模式
function IntToBytes(number) {
    var bytes = [];
    var i = 0;
    do {
        bytes[i++] = number & (255);
        number = number >> 8;
    } while (i < 4)
    return bytes;
}


//过新版8555检测
if (address.MenuItemDevToolsString) {
    var menuItemDevToolsStringCr = new Uint8Array(address.MenuItemDevToolsString.readByteArray(7));
    var intptr_ = (menuItemDevToolsStringCr[3] & 0xFF) | ((menuItemDevToolsStringCr[4] & 0xFF) << 8) | ((menuItemDevToolsStringCr[5] & 0xFF) << 16) | ((menuItemDevToolsStringCr[6] & 0xFF) << 24);
    var menuItemDevToolsStringPtrData = address.MenuItemDevToolsString.add(intptr_ + 7);
    Memory.protect(menuItemDevToolsStringPtrData, 8, 'rw-')
    menuItemDevToolsStringPtrData.writeUtf8String("DevTools");
}


//hook 启动配置项
/*
if(address.LaunchAppletBegin){
    Interceptor.attach(address.LaunchAppletBegin, {
        onEnter(args) {
            send("HOOK到小程序加载! " + readStdString(this.context.rsi));

            for (var i = 0; i < 0x1000; i+=8) {
                try {
                    var s = readStdString(this.context.rsi.add(i))
                   
                    var s1 = s.replaceAll("md5", "md6")
                        .replaceAll('"enable_vconsole":false', '"enable_vconsole": true')
                        .replaceAll('"frameset":false', '"frameset": true')
                        //"frameset":false
                    if (s !== s1) {
                        writeStdString(this.context.rsi.add(i), s1)
                    } 
                } catch (a) {
                }
            }

        }}
    )
}
*/
if (address.LaunchAppletBegin) {

    if (version >= 9105) {
        Interceptor.attach(address.LaunchAppletBegin, {
            onEnter(args) {
                send("[+] HOOK到小程序加载! " + readStdString(this.context.rsi))
                let ComJsInfo = this.context.rsi.add(896);  // 命令参数 在结构体里面是固定的位置
                var s = readStdString(ComJsInfo)
                var s1 = s.replaceAll('"enable_vconsole":false', '"enable_vconsole": true').replaceAll('"frameset":false', '"frameset": true')
                writeStdString(ComJsInfo, s1)
            }
        });

    } else {
        var LaunchAppletPtr = new NativeFunction(address.LaunchAppletBegin, 'bool', ['pointer', 'pointer', 'pointer']);
        Interceptor.attach(LaunchAppletPtr, {
            onEnter(args) {
                send("[+] HOOK到小程序加载! " + readStdString(this.context.rdx))
                let ComJsInfo = this.context.r8.add(896);  // 命令参数 在结构体里面是固定的位置
                var s = readStdString(ComJsInfo)
                var s1 = s.replaceAll('"enable_vconsole":false', '"enable_vconsole": true').replaceAll('"frameset":false', '"frameset": true')
                writeStdString(ComJsInfo, s1)
            }
        })

    }

}




//过部分小程序检测debugger模式
if (address.SetEnableDebug) {
    Memory.protect(address.SetEnableDebug, 20, 'rw-')
    address.SetEnableDebug.writeUtf8String(" etEnableDebug")
}




if (version >= 9105 && address.WechatAppHtml && address.WechatWebHtml && data?.WechatAppHtmlText && data?.WechatWebHtmlText) {
    var WechatAppHtml堆地址相对于当前代码的偏移 = address.WechatAppHtml.add(3).readUInt()
    var WechatAppHtml堆地址 = address.WechatAppHtml.add(WechatAppHtml堆地址相对于当前代码的偏移 + 7);
    Memory.protect(WechatAppHtml堆地址, data.WechatAppHtmlText.length, 'rw-')
    WechatAppHtml堆地址.writeUtf8String(data.WechatWebHtmlText);
}



if (version < 9105 && address.WechatAppHtml && address.WechatWebHtml) {

    Interceptor.attach(address.WechatAppHtml, {
        onEnter(args) {
            send(1111)
            this.context.rdx = address.WechatWebHtml;
            send("已还原完整F12")
        }
    })
}



send("WeChatAppEx.exe 注入成功!")
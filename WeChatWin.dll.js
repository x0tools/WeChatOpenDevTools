const regedit = require('regedit').promisified;
const path = require("path");
const fs = require('fs');
var frida = require("frida");
// 定义要读取的注册表路径



function onMessage(message, data) {
    if (message.type === 'send') {
        console.log(message.payload);
    } else if (message.type === 'error') {
        console.error(message.stack);
    }
}



;;;;(async function Run(){
    let WeChatArg = (process.argv[2] );
    let addressSource =fs.readFileSync(path.join(__dirname, `/Core/WeChatWin.dll/hook.js`)); 
    if(!WeChatArg){
        WeChatArg = WeChatArg+"";
        const regPath = 'HKCU\\SOFTWARE\\Tencent\\WeChat';
        let regls =  await regedit.list(regPath);
        let installPath = regls[regPath]["values"]?.InstallPath?.value;
        if(!installPath){
            console.log("未找到微信安装路径 请手动指定 node WeChatWin.dll.js \"C:\\Program Files\\Tencent\\WeChat\\你的版本\\WeChat.exe\"");
        }
        let version = regls[regPath]["values"]?.Version?.value;
        if(!version){
            console.log("未找到微信安装路径 请手动指定 node WeChatWin.dll.js \"C:\\Program Files\\Tencent\\WeChat\\你的版本\\WeChat.exe\"");
        }
    
        let hexVersion = version.toString(16);
    
        hexVersion = hexVersion.replace(hexVersion[0],'0');
    
        let new_hex_num  = parseInt(hexVersion,16);
        let major = (new_hex_num >> 24) & 0xFF
        let minor = (new_hex_num >> 16) & 0xFF
        let patch = (new_hex_num >> 8) & 0xFF
        let build = (new_hex_num >> 0) & 0xFF
        version = `[${major}.${minor}.${patch}.${build}]`;
        WeChatArg = path.join(installPath,version,"WeChat.exe")
    }
    var device = await frida.getLocalDevice();
    var pid = await device.spawn(WeChatArg)
    session = await frida.attach(pid);
    script = await session.createScript(addressSource);
    script.message.connect(onMessage);
    await script.load();
    await device.resume(pid)
   
})().catch((error)=>{
    console.error(error.stack);
});


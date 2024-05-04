var cpsPtr = Module.findExportByName("kernel32.dll", "CreateProcessW");
var cps = new NativeFunction(cpsPtr,'bool', ['pointer', 'pointer', 'pointer', 'pointer', 'bool', 'uint32', 'pointer', 'pointer', 'pointer', 'pointer']);

Interceptor.attach(cpsPtr, {
    onEnter: function (args) {
        this.pi = args[9];
        this.exepath = args[0];
        this.cmdline = args[1];
        let aaa = this.cmdline.readUtf16String();
        aaa = aaa.replaceAll("--log-level=2", "--log-level=0 --xweb-enable-inspect=1");
        this.cmdline.writeUtf16String(aaa);
    },
    onLeave: function (retval) {
        console.log("可执行路径：", this.exepath.readUtf16String());
        console.log("命令行参数：", this.cmdline.readUtf16String());
        console.log("进程id: ", this.pi.add(16).readU32());
    }
}
);
# WeChatOpenDevTools


###  ~~因部分原因本库已删除~~
###  不定时更新偏移 自己下载对应版本的偏移文件进行替换 

> 注意！！！  3.9.9以上版本的微信对devtools添加一处检测，目前 已知3.9.9的小程序版本8555中有检测.
>
> 检测点分析： 检测小程序菜单栏中的菜单项是否为devTools  
>
> 方案1 打静态或动态补丁修改对应data段 devTools
>
> 方案2 设置小程序目录的8555为不可读不可写 强制不让wx使用8555
>
> 方案3 下载3.9.8 版本或更早版本  其中的8555为无检测版本
>
> 本库提供 过检测版本的 WeChatOpenDevTools\Core\WeChatAppEx.exe\hook.js 自行替换

[偏移文件使用视频教程](https://www.bilibili.com/video/BV1aa4y197UU/?spm_id_from=333.999.0.0&vd_source=991584598cec1f0498349336312cee2f)

视频中需要的文件在下面的QQ群

###  如果没有你的版本 联系下面群主

##  方法1. 

要查看小程序版本的话 在文件管理器地址里 打上 %appdata%\Tencent\WeChat\XPlugin\Plugins\RadiumWMPF\  回车即可看到 如果里面有多个文件的话全部删除后重新打开微信即可看到文件夹中重新生成的文件名

##  方法2. 

也可以用任务管理器查看名为WeChatAppEx.exe的文件路径  
如：C:\Users\你的用户名\AppData\Roaming\Tencent\WeChat\XPlugin\Plugins\RadiumWMPF\8519\extracted\runtime 
其中 8519就是版本

### 该学习的已经学习完成了！还要继续学习新东西的话 加下面的群吧
[如果你有不方便发的东西 可以加入我们的TG群](https://t.me/+208rGDduK4s1NWU1)

[你也可以加入专门玩js逆向的交流QQ群【JsDebug】](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=8M97BQs-icsb3BitUoqxqIHIBcf6ayLf&authKey=kAJwU36Ih9k7nWbYXtUnXeZnnXOFpQpvv4Zl4PGxdCNd1icroeGsgK1eTpSVMXSw&noverify=0&group_code=461168359)                             


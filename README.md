# LAV-颐养系统

[![](https://img.shields.io/badge/LAV-CoverSystem-blue)](https://github.com/MiyamizuSu/LAV-NursingCenter)



## 目录

- [背景](#背景)
- [安装](#安装)
- [主要项目负责人](#主要项目负责人)
- [项目结构](#项目结构)
- [参与贡献方式](#参与贡献方式)
    - [贡献人员](#贡献人员)
- [开源协议](#开源协议)

## 背景

当前中国老年人越来越多,需要越来越多的颐养中心帮助老年人进行颐养,让他们安度晚年,所以开发了这样一套颐养中心控制系统来帮助管理员以及护工来管理颐养中心

## 安装

[![](https://img.shields.io/badge/%E4%B8%8B%E8%BD%BD-LAV_CoverSystem-blue?style=plastic
)](README.md)

本系统采用VUE-TS-VITE的架构开发,

你可以把本项目克隆到本地,之后请检查你的依赖版本,不应低于以下

![](https://img.shields.io/badge/Node-18.0.1-blue?style=plastic
)![](https://img.shields.io/badge/VUE-3.5-green?style=plastic
)![](https://img.shields.io/badge/TypeScript-2.9-blue?style=plastic
)

之后在控制台中运行
``` 
npm install

npm run dev
```
需要打包至生产环境中运行
````
npm run build
````
对以下浏览器支持友好

![](https://img.shields.io/badge/Chrome-yellow?style=plastic
)![](https://img.shields.io/badge/Edge-blue?style=plastic
)

对于Safari的支持上,某些动画效果可能会出现问题


## 项目结构
```
LAV
├── src
│   ├──assets   
│   ├──components     #组件库
│   │   ├──ui         #shad-cn提供组件库   
│   │   └──custom     #自定义组件库  
│   ├──lib            #ts支持库
│   ├──pages          #页面库
│   │   ├──bdm        #管理员床位管理页面  
│   │   ├──ctm        #管理员客户管理页面
│   │   ├──cts        #护工客户管理页面   
│   │   ├──htm        #管理员健康管家页面
│   │   ├──hts        #护工健康管家管理页面
│   │   ├──mlm        #管理员膳食管理页面
│   │   ├──nsm        #管理员护理管理页面
│   │   └──usm        #管理员用户管理
│   ├──main.ts        #入口ts
│   ├──index.css      #提供tailwindCss支持  
│   └──App.vue        #根Vue
├── .env    #环境变量
├── components.json    #Shad-cn申明组件表
├── package.lock.json
├── package.json       #依赖配置文件
└── vite.config.json   #vite打包配置文件
```


## 主要项目负责人

[@MiyamizuSu](https://github.com/MiyamizuSu)
[@suyeguanxing](https://github.com/suyeguanxing)
[@XhKCS](https://github.com/XhKCS)
[@Yrugit](https://github.com/Yrugit)

## 参与贡献方式

[![](https://img.shields.io/badge/GIVE-Pull_Request-blue?style=plastic
)](https://github.com/MiyamizuSu/LAV-NursingCenter/pulls)

提交 [PR](https://github.com/sunyctf/ChineseREADME/pulls) 申请，我会视情况通过。

### 贡献人员

感谢所有贡献的人。

[@MiyamizuSu](https://github.com/MiyamizuSu)
[@suyeguanxing](https://github.com/suyeguanxing)
[@XhKCS](https://github.com/XhKCS)
[@Yrugit](https://github.com/Yrugit)

## 开源协议

[MIT](LICENSE) [@MiyamizuSu]()
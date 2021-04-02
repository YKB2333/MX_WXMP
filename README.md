# 秒寻-微信小程序

## 项目启动
### 1.下载依赖
```
npm install
```
## 公共配置文件=>config/index.js

### 2.本地开发（先在src/config目录下新建dev.js，将src/config/test.js的内容copy到dev.js）
```
npm run dev
```

### 3.测试环境打包（对应配置文件=>src/config/test.js）
```
npm run build:test
```

### 4.生产环境打包（对应配置文件=>src/config/prod.js）
```
npm run build
```
### 5.配置说明
若该配置项需区分环境，则应该将其写在对应的config/dev\test\prod.js文件，如：baseUrl（请求地址）
若该配置项无需区分环境，不随环境而变化，建议将其写在config/index.js文件，如：headersTokenKey（请求头里携带token的key值）



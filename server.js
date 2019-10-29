/*
 * @Description: 
 * @Author: jiannan.lv
 * @Date: 2019-10-15 09:01:30
 * @LastEditTime: 2019-10-15 17:28:07
 * @LastEditors: jiannan.lv
 */
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser')
const routers = require('./routers');
const app = express();
// gzip
app.use(compression());
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:2019');
  res.header('Access-Control-Allow-Headers', 'Content-Type=application/json;charset=UTF-8');
  res.header('Access-Control-Allow-Credentials', true)//支持跨域传cookie
  /* res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');*/
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '100000kb' }));
// 加载路由中间件
routers.forEach(router => {
  app.use(router);
});

// compiler
app.listen(8800);

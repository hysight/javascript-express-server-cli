/*
 * @Description: 
 * @Author: jiannan.lv
 * @Date: 2019-10-15 11:21:07
 * @LastEditTime: 2019-10-17 11:52:21
 * @LastEditors: jiannan.lv
 */
'use strict';
const express = require('express');
// const svgCaptcha = require('svg-captcha');
const md5 = require('blueimp-md5');
const Mysql = require('mysql');
const router = express.Router();
const requestUtil = require('../libs/requestUtil');
const routerUtil = require('../libs/routerUtil');
const connection = Mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password : '123456',
  database : 'mysql_study',
  port: 3306
});
 
connection.connect(function(err){
  if(err) {
      return;
  }
});

routerUtil.post(router, '/login', (req, res) => {
  const args = req.body;
  const { name, passward } = args;
  connection.query('SELECT * from userlist', function (error, results, fields) {
    if(results) {
      const userArr = results.filter(item => item.name === name);
      if(userArr && userArr.length > 0 && userArr[0].passward === passward) {
        res.json({ code: '000000', data: { id: userArr[0].id, token: md5(`${name.toLowerCase()}@100credit${passward.toUpperCase()}com`),userName: name, userType: 1 }, message: '登录成功' });
      }else if(userArr.length === 0) {
        res.json({ code: '000001', message: '该用户不存在' });
      }else if (userArr && userArr.length > 0 && userArr[0].passward !== passward) {
        res.json({ code: '000001', message: '密码不正确' });
      }
    }
  });
  // connection.end();
  // const md5_caption = md5(`${verifyCode.toLowerCase()}@100credit${verifyCode.toUpperCase()}com`)
  // if (sessionid !== md5_caption) {
  //   res.json({ code: '000001', message: '验证码不正确' });
  //   return;
  // }
  // res.json({ code: '000000', data: { id: 1, token: md5(`${userName.toLowerCase()}@100credit${verifyCode.toUpperCase()}com`),userName: '测试用户', userType: 1 } })
});
module.exports = router;

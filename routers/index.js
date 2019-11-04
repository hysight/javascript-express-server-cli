/*
 * @Description: 
 * @Author: jiannan.lv
 * @Date: 2019-10-15 11:34:06
 * @LastEditTime: 2019-10-15 11:34:06
 * @LastEditors: jiannan.lv
 */
const loginRouter = require('./login.router');
const userlistRouter = require('./userlist.router');
const dragListRouter = require('./drag.router');
module.exports = [loginRouter, userlistRouter, dragListRouter];

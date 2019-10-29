/*
 * @Description: 
 * @Author: jiannan.lv
 * @Date: 2019-10-15 11:21:07
 * @LastEditTime: 2019-10-17 11:52:21
 * @LastEditors: jiannan.lv
 */
'use strict';
const express = require('express');
const Mysql = require('mysql');
const router = express.Router();
const requestUtil = require('../libs/requestUtil');
const routerUtil = require('../libs/routerUtil');
const connection = Mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'mysql_study',
  port: 3306
});

connection.connect(function (err) {
  if (err) {
    return;
  }
});

// 获取用户数据列表
routerUtil.post(router, '/user/userlist', (req, res) => {
  const args = req.body;
  const { page = 1, pageSize = 10, key = "" } = args;
  const querySql = `select * from userlist where name like '%${key}%' or department like '%${key}%' order by id limit ${(page - 1) * pageSize}, ${pageSize}`;
  const queryCountSql = `select count(1) as count from userlist where name like '%${key}%' or department like '%${key}%'`;
  const data = {
    page: Number(page),
    pageSize: Number(pageSize)
  };
  connection.query(queryCountSql, function (error, results, fields) {
    data.total = results[0].count;
  });
  connection.query(querySql, function (error, results, fields) {
    if (results) {
      data.list = results;
      res.json({ code: '000000', data: data, message: 'success' });
    }
  });
});
// 新增、编辑用户数据
routerUtil.post(router, '/user/addUser', (req, res) => {
  const args = req.body;
  const { name, passward, department, mark, id = '' } = args;
  const addUserSql = `insert into userlist (name, passward, department, mark) VALUES ('${name}', '${passward}', '${department}', '${mark}')`;
  const editUserSql = `UPDATE userlist SET name='${name}', passward='${passward}', department='${department}', mark='${mark}' WHERE id = ${id}`;
  const excuteSql = id ? editUserSql : addUserSql;
  connection.query(excuteSql, function (error, results, fields) {
    if (results) {
      res.json({ code: '000000', data: id ? '编辑成功' : '添加成功', message: 'success' });
    }
  });
});
// 删除用户
routerUtil.post(router, '/user/deleteUser', (req, res) => {
  const args = req.body;
  const { id } = args;
  const deleteUserSql = `DELETE FROM userlist WHERE id = '${id}'`;
  connection.query(deleteUserSql, function (error, results, fields) {
    if (results) {
      res.json({ code: '000000', data: '删除成功', message: 'success' });
    }
  });
});
module.exports = router;

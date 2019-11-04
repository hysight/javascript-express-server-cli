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
// 获取图表数据列表
routerUtil.post(router, '/drag/chartlist', (req, res) => {
  const args = req.body;
  const { page = 1, pageSize = 10, key = "" } = args;
  const querySql = `select chartId, chName, enName, createTime, mark from chartlist where chName like '%${key}%' or enName like '%${key}%' limit ${(page - 1) * pageSize}, ${pageSize}`;
  const queryCountSql = `select count(1) as count from chartlist where chName like '%${key}%' or enName like '%${key}%'`;
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
// 新增、更新流程数据
routerUtil.post(router, '/drag/addchart', (req, res) => {
  const args = req.body;
  const { chartId, chName, enName, createTime, design, mark, type } = args;
  const addChartSql = `insert into chartlist (chartId, chName, enName, createTime, design, mark) VALUES ('${chartId}', '${chName}', '${enName}', '${createTime}', '${design}', '${mark}')`;
  const updateChartSql = `UPDATE chartlist SET design='${design}' WHERE chartId = '${chartId}'`;
  const excuteSql = type === 'update' ? updateChartSql : addChartSql;
  connection.query(excuteSql, function (error, results, fields) {
    if (results) {
      res.json({ code: '000000', data: '保存成功', message: 'success' });
    }
  });
});
// 获取流程详情
routerUtil.post(router, '/drag/flowDetail', (req, res) => {
  const args = req.body;
  const { chartId } = args;
  const querySql = `select * from chartlist where chartId = '${chartId}'`;
  connection.query(querySql, function (error, results, fields) {
    if (results) {
      res.json({ code: '000000', data: results[0], message: 'success' });
    }
  });
});
// 删除流程
routerUtil.post(router, '/drag/deleteChart', (req, res) => {
  const args = req.body;
  const { chartId } = args;
  const deleteUserSql = `DELETE FROM chartlist WHERE chartId = '${chartId}'`;
  connection.query(deleteUserSql, function (error, results, fields) {
    if (results) {
      res.json({ code: '000000', data: '删除成功', message: 'success' });
    }
  });
});
module.exports = router;

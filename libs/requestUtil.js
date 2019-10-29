/*
 * @Description: 
 * @Author: jiannan.lv
 * @Date: 2019-10-15 11:30:23
 * @LastEditTime: 2019-10-15 11:33:17
 * @LastEditors: jiannan.lv
 */
const config = require('../config/web.config');
const fs = require('fs');
fs.exists('web.config.local.json', exists => {
  if (exists) {
    const localconfig = JSON.parse(fs.readFileSync('web.config.local.json'));
    if (localconfig) {
      Object.assign(config, localconfig);
    }
  }
});

const request = require('request');
const timeout = 120000;

module.exports = {
  postData(url, params, api = 'default', headers = {}) {
    let apiUrl = '';
    switch (api) {
      case 'default':
        apiUrl = config.apiUrl;
        break;
      default:
        apiUrl = config[`${api}_apiUrl`];

    }

    url = apiUrl + url;
    const options = {
      headers: Object.assign({ Connection: 'close' }, headers),
      url,
      timeout,
      method: 'POST',
      json: true,
      body: params
    };
    return new Promise(resolve => {
      // request.post(options, callback).form(params);
      if (JSON.stringify(params).length < 5000) {
        console.log(url + '\n' + JSON.stringify(params));
      } else {
        console.log(url + '\n显示部分参数：' + JSON.stringify(params).substring(0, 5000));
      }

      request.post(options, (error, response, data) => {
        if (!error && response.statusCode === 200) {
          console.log('-------------调用成功 ' + url + '---------------');
          if (config.env === 'develop') {
            console.log(JSON.stringify(data));
          }
          resolve(data);
        } else {
          if (error) {
            const err = this.errorHandle(error);
            console.log(url + ':' + err.message);
            resolve(err);
          }
        }
      });
    });
  },

  getData(url, api = 'default') {
    let apiUrl = '';
    switch (api) {
      case 'default':
        apiUrl = config.apiUrl;
        break;
      default:
        apiUrl = config[`${api}_apiUrl`];
    }
    url = apiUrl + url;
    const options = {
      url,
      timeout
    };
    return new Promise(resolve => {
      console.log(url);
      request.get(options, (error, response, data) => {
        if (!error && response.statusCode === 200) {
          console.log('-------------调用成功 ' + url + '---------------');
          if (config.env !== 'production') {
            console.log(data);
          }
          resolve(JSON.parse(data));
        } else {
          if (error) {
            const err = this.errorHandle(error);
            console.log(err);
            resolve(err);
          }
        }
      });
    });
  },
  errorHandle(error) {
    const err = {
      code: error.code,
      message: error.message
    }
    switch (error.code) {
      case 'ENETUNREACH':
      case 'ENOTFOUND':
        err.code = 10001;
        err.message = '网络异常';
        break;
      case 'ESOCKETTIMEDOUT':
      case 'ETIMEDOUT':
        err.code = 10003;
        err.message = '请求超时'
        break;
      default:
        err.code = 10000;
        break;
    }
    return err;
  }

}

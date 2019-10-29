/*
 * @Description: 
 * @Author: jiannan.lv
 * @Date: 2019-10-15 11:28:43
 * @LastEditTime: 2019-10-15 17:01:55
 * @LastEditors: jiannan.lv
 */
const routerDirectory = '/api';

module.exports = {
  setApiUrl(url) {
    return `${routerDirectory}${url}`
  },
  post(router, url, func) {
    router.post(this.setApiUrl(url), func);
  }
}

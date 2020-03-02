//全局常量
export const CONSTS = {
  TOKEN: '',
  ServiceURL: 'http://zd.aio315.com:9001',
  // ServiceURL: 'https://zs.yufengseeds.com',
 // ServiceURL: 'http://47.105.153.42:9001',
  Company: '',
  Slogan: '',
}
//全局请求头
export function getHeader() {
  return {
    Authorization: 'Bearer ' + CONSTS.TOKEN,
    'content-type': 'application/json',
  }
}

const globalData = {}
export function set(key, val) {
  globalData[key] = val;
}

export function get(key) {
  return globalData[key]
}

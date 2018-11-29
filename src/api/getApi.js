import request from '../request'

export function postApi (apiRoute, param) {
  return request({
    method: 'post',
    url: `/index?method=${apiRoute}&format=json`,
    data: param,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  })
}
export function postFileApi (apiRoute, param) {
  return request({
    method: 'post',
    url: `/index?method=${apiRoute}&format=json`,
    data: param
  })
}

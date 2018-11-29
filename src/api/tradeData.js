import jsonp from '../common/js/jsonp.js'
import {commonParams, options} from './config.js'

export function getTradeData () {
  const url = 'http://cq.ssajax.cn/interact/getTradedata.ashx?pic=qlpic_000001_1_6'

  const data = Object.assign({}, commonParams, {

  })

  return jsonp(url, data, options)
}

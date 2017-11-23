import moment from 'moment'

export function valueOrHyphen(value) {
  return value ? value : '-'
}

export function formatDateTime(value) {
  return value ?
    moment(value).format('YYYY-MM-DD HH:mm:ss') :
    '-'
}

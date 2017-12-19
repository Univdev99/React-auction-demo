import Immutable from 'immutable'

export const ucFirst = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1)

export const queryStringToJson = (query) => {     
  const pairs = query ? query.slice(1).split('&') : []
  
  const result = {}
  pairs.forEach((pair) => {
    pair = pair.split('=')
    result[pair[0]] = decodeURIComponent(pair[1] || '')
  })

  return JSON.parse(JSON.stringify(result))
}

export const jsonToQueryString = (obj) => {
  const pairs = []
  obj && Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      const value = encodeURIComponent(obj[key])
      value && pairs.push(`${key}=${value}`)
    }
  })

  return pairs.length ? `?${pairs.join('&')}` : ''
}

export const keyIn = (...keys) => (v, k) =>
  Immutable.Set(keys).has(k)

export const pick = (map, keys) => map.filter(keyIn(...keys))

export const stripTags = (str) => {
  const div = document.createElement('div')
  div.innerHTML = str
  return div.textContent || div.innerText || ''
}

export const truncateWords = (str, words = 10) => {
  const splitted = str.split(' ')
  const trail = splitted.length > words ? ' ...' : ''
  return splitted.splice(0, words).join(' ') + trail
}

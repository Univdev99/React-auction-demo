
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
    obj[key] && pairs.push(`${key}=${encodeURIComponent(obj[key])}`)
  })

  return pairs.length ? `?${pairs.join('&')}` : ''
}

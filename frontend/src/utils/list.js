import Immutable from 'immutable'


export function replaceListItem(payload, map, key, loadedKey = null) {
  loadedKey = loadedKey ? loadedKey : `${key}Loaded`
  if (map.get(loadedKey)) {
    const { pk } = payload
    const list = map.get(key)
    const index = list.findIndex(item => item.get('pk') === pk)
    if (index >= 0) {
      map.setIn([key, index], Immutable.fromJS(payload))
    }
  }
}

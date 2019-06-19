import Vue from 'vue'

export function debounce (func, immediate = false) {
  let timeout
  return function () {
    let later = () => {
      timeout = null
      if (!immediate) func(...arguments)
    }
    let callNow = immediate && !timeout
    window.cancelAnimationFrame(timeout)
    timeout = window.requestAnimationFrame(later)
    if (callNow) func(...arguments)
  }
}

export function classify (str) {
  return str.match(/[a-z]+/gi)
    .map(word => { return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase() })
    .join('')
}

export function dasherize (str) {
  return str.replace(/[\W_]+/g,'-').toLowerCase()
  // return str.replace(/([A-Z_])/g, ($1) => { return '-' + $1.toLowerCase() })
}

export function underscore (str) {
  return str.replace(/[\W-]+/g,'_').toLowerCase()
  // return str.replace(/([A-Z-])/g, ($1) => { return '_' + $1.toLowerCase() })
}

export function titleize (str) {
  return str.replace(/[A-Z]/g, ' $&').replace(/_/g, ' ').replace(/^./, str => str.toUpperCase())
}

export function randomString(len) {
  const p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(len)].reduce(a=>a+p[~~(Math.random()*p.length)],'')
}

export function toggleFullscreen(elem) {
  elem = elem || document.documentElement
  if (!document.fullscreenElement && !document.mozFullScreenElement &&
    !document.webkitFullscreenElement && !document.msFullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen()
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen()
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
    }
  }
  else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }
}

export function pick(object, keys) {
  return keys.reduce((result, key) => {
    result[key] = object[key]
    return result
  }, {})
}

export function clone(object) {
  // NOTE: Use JSON serialization to clean references
  return JSON.parse(JSON.stringify(object))
}

export function isObject(object) {
  const type = typeof object
  return type === 'function' || type === 'object' && !!object;
}

export function copyValue(value) {
  if (isObject(value))
    return clone(value)
  else if (typeof value === 'string')
    return String(value)
  return value
}

export function sanitizeDecimal (value) {
  // if (typeof(value) !=)
  return parseFloat(String(value).replace(/[^0-9\.-]+/g,''))
}

export function mergeSpecDefaults (item, spec) {
  if (!item.id)
    item.id = item.name + '-' + randomString(8)
  if (!item.data)
    item.data = {}
  if (spec.properties) {
    Object.keys(spec.properties).forEach(x => {
      if (typeof(item.data[x]) === 'undefined') {
        if (typeof(spec.properties[x].default) !== 'undefined')
          item.data[x] = spec.properties[x].default
        else
          // NOTE: Initializing to null if there is no default is important
          // in order to acheive reactivity with newly added items.
          item.data[x] = null
      }
    })
  }
  if (spec.data) {
    Object.assign(item.data, spec.data)
  }
  // if (spec.items) {
  //   if (!item.items)
  //     item.items = []
  //   item.items.push(...spec.items)
  // }
  return item
}

export function sortItemsBy (items, member) {
  const res = {}
  Object.keys(items).forEach(x => {
    const elem = items[x]
    if (elem[member]) {
      if (!res[elem[member]]) {
        res[elem[member]] = []
      }
      elem.name = x
      res[elem[member]].push(elem)
    }
  })
  return res
}

export function mergeObject (target, source) {
  Object.keys(source).forEach(key => { Vue.set(target, key, source[key]) })
  return target
}

export function resetObject (target, source) {
  Object.keys(target).forEach(key => { Vue.delete(target, key) })
  if (source)
    return mergeObject(target, source)
}

import Vue from 'vue'

export function debounce (func, immediate = false) {
  let timeout
  return () => {
    let later = () => {
      timeout = null
      if (!immediate) func.apply(this, ...arguments)
    }
    let callNow = immediate && !timeout
    window.cancelAnimationFrame(timeout)
    timeout = window.requestAnimationFrame(later)
    if (callNow) func.apply(this, ...arguments)
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

export function truncate (str, length = 200, ending = '...') {
  if (str && str.length > length) {
    return str.substring(0, length - ending.length) + ending
  } else {
    return str
  }
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

export function isSet(value) {
  if (typeof(value) === 'string')
    return value.length > 0
  if (typeof(value) === 'number')
    return value > 0
  return value !== null && typeof(value) !== 'undefined'
}

export function sanitizeDecimal (value) {
  // if (typeof(value) !=)
  return parseFloat(String(value).replace(/[^0-9\.-]+/g,''))
}

export function defaultLocale(locale) {
  if (locale) return locale
  if (typeof(navigator) !== 'undefined') return navigator.language
  return 'en'
}

export function formatNumber(number, locale) {
  locale = defaultLocale(locale)
  try {
    number = sanitizeDecimal(number)
    if (isNaN(number))
      return null // do not parse non-numbers
    // if (!number) return 0
    return number.toLocaleString(locale)
  } catch (e) {
    console.log('format number failed', e)
    return number
  }
}

export function formatMoney(number, currency, locale) {
  locale = defaultLocale(locale)
  currency = currency || 'EUR' // FIXME
  number = sanitizeDecimal(number)
  if (isNaN(number))
    return null // do not parse non-numbers
  try {
    // console.log('format currency', number)
    return number.toLocaleString(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    })
  } catch (e) {
    console.log('format currency failed', e)
    return number.toFixed(2)
  }
}

export function mergeSpecDefaults (object, spec) {
  if (!object.id)
    object.id = object.name + '-' + randomString(8)
  if (!object.data)
    object.data = {}
  if (spec.properties) {
    Object.keys(spec.properties).forEach(x => {
      if (typeof(object.data[x]) === 'undefined') {
        if (typeof(spec.properties[x].default) !== 'undefined')
          object.data[x] = spec.properties[x].default
          // Vue.set(object.data, x, spec.properties[x].default)
        else
          // NOTE: Initializing to null if there is no default is important
          // in order to acheive reactivity with newly added objects.
          object.data[x] = null
          // Vue.set(object.data, x, null)
      }
    })
  }
  if (spec.data) {
    Object.assign(object.data, spec.data)
  }
  // if (spec.objects) {
  //   if (!object.objects)
  //     object.objects = []
  //   object.objects.push(...spec.objects)
  // }
  return object
}

export function sortItemsBy (objects, member) {
  const res = {}
  Object.keys(objects).forEach(x => {
    const elem = objects[x]
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

export function cloneValues(object, keys) {
  const partial = pick(object, keys)
  return clone(partial)
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

export function mergeObject (target, source) {
  Object.keys(source).forEach(key => { Vue.set(target, key, source[key]) })
  return target
}

export function resetObject (target, source) {
  Object.keys(target).forEach(key => { Vue.delete(target, key) })
  if (source)
    return mergeObject(target, source)
}

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
  return str.replace(/([A-Z_])/g, ($1) => { return '-' + $1.toLowerCase() })
}

export function underscore (str) {
  return str.replace(/([A-Z-])/g, ($1) => { return '_' + $1.toLowerCase() })
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

export function isObject(object) {
  const type = typeof object
  return type === 'function' || type === 'object' && !!object;
}

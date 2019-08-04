// export function debounce (func, immediate = false) {
//   let timeout
//   return function () {
//     let later = () => {
//       timeout = null
//       if (!immediate) func(...arguments)
//     }
//     let callNow = immediate && !timeout
//     window.cancelAnimationFrame(timeout)
//     timeout = window.requestAnimationFrame(later)
//     if (callNow) func(...arguments)
//   }
// }
//
// export function classify (str) {
//   return str.match(/[a-z]+/gi)
//     .map(word => { return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase() })
//     .join('')
// }
//
// export function dasherize (str) {
//   return str.replace(/[\W_]+/g,'-').toLowerCase()
//   // return str.replace(/([A-Z_])/g, ($1) => { return '-' + $1.toLowerCase() })
// }
//
// export function underscore (str) {
//   return str.replace(/[\W-]+/g,'_').toLowerCase()
//   // return str.replace(/([A-Z-])/g, ($1) => { return '_' + $1.toLowerCase() })
// }
//
// export function randomString (len) {
//   const p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   return [...Array(len)].reduce(a=>a+p[~~(Math.random()*p.length)],'')
// }

// export function getViewModule (m, scope, name) {
//   console.log(`Loading view: ${scope}: ${name}`)
//   if (m[scope] && m[scope][name])
//     return m[scope][name]
//   if (m.default[scope] && m.default[scope][name])
//     return m.default[scope][name]
//   throw Error('Module does not exist: ' + name)
// }

// export function importThemeElement (theme, name) {
//   name = classify(name) + 'Element'
//   // console.log(`Loading theme element: ${name}`)
//   return () => import(/* webpackChunkName: "core" */ `@/themes/${theme}/views`)
//       .then(m => getViewModule(m, 'elements', name))
//       // .catch(e => {
//       //   console.log(`Cannot load theme element: ${name}`)
//       //   throw e
//       // })
// }

// export function importDesignerElement (name) {
//   name = classify(name) + 'Element'
//   // console.log(`Loading designer element: ${name}`)
//   return () => import(/* webpackChunkName: "designer" */ `./components/editor-elements`)
//       .then(m => {
//         if (m[name])
//           return m[name]
//         if (m.default[name])
//           return m.default[name]
//         throw Error('Designer module does not exist: ' + name)
//       })
//       // .catch(e => {
//       //   console.log(`Cannot load designer element: ${name}`)
//       //   throw e
//       // })
// }

// export function importThemePage (theme, page) {
//   page = classify(page)
//   return () => import(/* webpackChunkName: "core" */ `@/themes/${theme}/views`)
//       .then(m => getViewModule(m, 'pages', page))
//       // .catch(e => {
//       //   console.log(`Cannot load theme page: ${page}`)
//       //   throw e
//       // })
// }
//
// export function importThemeLayout (theme, layout) {
//   layout = classify(layout) + 'Layout'
//   // console.log(`Loading designer layout: ${layout}`)
//   return () => import(/* webpackChunkName: "core" */ `@/themes/${theme}/views`)
//       .then(m => getViewModule(m, 'layouts', layout))
//       // .catch(e => {
//       //   console.log(`Cannot load theme layout: ${layout}`)
//       //   throw e
//       // })
// }

export function gridItemClasses (columns = 4, disableResponsive = false, aspectRatio = 1, disableStretch = false) {
  switch(columns) {
    case 1:
      return 'col-12'
    case 2:
      if (disableResponsive)
        return 'col-6'
      else
        return 'col-12 col-sm-6'
    case 3:
      if (disableResponsive)
        return 'col-4'
      else {
        if (!disableStretch && aspectRatio < 0.5)
          return 'col-12 col-sm-6 col-lg-8'
        else
          return 'col-12 col-sm-6 col-lg-4'
      }
    default:
      if (disableResponsive)
        return 'col-3'
      else {
        if (!disableStretch && aspectRatio < 0.5)
          return 'col-12 col-sm-6 col-lg-6'
        else
          return 'col-12 col-sm-6 col-lg-3'
      }
  }
}

import Vue from 'vue'

// export default {
//   install(Vue, options) {
    // Vue.directive('tooltip', function(el, binding) {
    //   if (!binding.value) return
    //   $(el).tooltip({
    //      title: binding.value,
    //      placement: binding.arg,
    //      trigger: 'hover'
    //    })
    //  })

    Vue.filter('humanSize', (size) => {
      if (size > 1024 * 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB'
      } else if (size > 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
      } else if (size > 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + ' MB'
      } else if (size > 1024) {
        return (size / 1024).toFixed(2) + ' KB'
      }
      return size.toString() + ' B'
    })

    // Vue.filter('titleize', (str) => {
    //   return str.replace(/[A-Z]/g, ' $&').replace(/_/g, ' ').replace(/^./, str => str.toUpperCase())
    // })
  // }
// }

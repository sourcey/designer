import Vue from 'vue'
import { store } from './store'


export default {
  slugify (value) {
    console.log('slugify', value)

    value = value.replace(/^\s+|\s+$/g, '') // trim
    value = value.toLowerCase()

    // remove accents, swap ñ for n, etc
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;"
    var to   = "aaaaaeeeeeiiiiooooouuuunc------"
    for (var i=0, l=from.length ; i<l ; i++) {
      value = value.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
    }

    value = value.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-') // collapse dashes

    return value
  },

  pathify (value) {
    value = value.replace(/^\//, '') // remove initial forward slash
    value = '/' + this.slugify(value)
    store.state.metadata.forEach(item => {
      if (item.data && item.data.path == value) {
        value += '-1'
      }
    })
    return value
  },

  executeCreate (spec, data) {
    const actions = spec.create
    if (actions) {
      for (var key in actions) {
        // data[key] = this[actions[key]](data[key])
        Vue.set(data, key, this[actions[key]](data[key]))
      }
    }
  },

  executeUpdate (spec, data, name, value) {
    const actions = spec.properties[name].update
    if (actions) {
      for (var key in actions) {
        // console.log('form section: onUpdate actions', actions, actions[key], this.$options.filters, this.$options.filters)
        // data[key] = this[actions[key]](value)
        Vue.set(data, key, this[actions[key]](value))
        // vm.$set(data, key, this[actions[key]](value))
        console.log('execute update action:', key, actions[key], data[key], data)
      }
    }
  },

  // executeDeletePage (spec, data, name, value) {
  //   const actions = spec.properties[name].update
  //   if (actions) {
  //     for (var key in actions) {
  //       // console.log('form section: onUpdate actions', actions, actions[key], this.$options.filters, this.$options.filters)
  //       // data[key] = this[actions[key]](value)
  //       Vue.set(data, key, this[actions[key]](value))
  //       // vm.$set(data, key, this[actions[key]](value))
  //       console.log('execute update action:', key, actions[key], data[key], data)
  //     }
  //   }
  // },

  // executeDeleteElement (spec, element) { //, name, value
  //     // Object.keys(spec.properties).forEach(key => {
  //     //   switch(spec.properties[key].type) {
  //     //     case 'attachment':
  //     //       break;
  //     //     case 'attachment_array':
  //     //       break;
  //     //     case 'attachment_array':
  //     //       break;
  //     //   }
  //     // })
  //   // const actions = spec.properties[name].update
  //   // if (actions) {
  //   //   for (var key in actions) {
  //   //     // console.log('form section: onUpdate actions', actions, actions[key], this.$options.filters, this.$options.filters)
  //   //     // data[key] = this[actions[key]](value)
  //   //     Vue.set(data, key, this[actions[key]](value))
  //   //     // vm.$set(data, key, this[actions[key]](value))
  //   //     console.log('execute update action:', key, actions[key], data[key], data)
  //   //   }
  //   // }
  // }
}

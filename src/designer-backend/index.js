import Vue from 'vue'
import Designer from './Designer'
import Toasts from './components/Toasts.vue'
import { store } from './store'
// import BootstrapVue from 'bootstrap-vue'


export default {
  start() {

    // Load the Vue app on DOMContentLoaded
    if (/complete|interactive|loaded/.test(document.readyState)) {
      this.load()
    } else {
      document.addEventListener('DOMContentLoaded', this.load, false)
    }
  },
  load() {

    // Toast notifications
    const toast = Vue.prototype.$toast = new Vue(Toasts).$mount()
    document.body.appendChild(toast.$el)

    const element = document.getElementById('app')
    const data = JSON.parse(element.getAttribute('data'))
    Object.assign(store.state, data)
    console.log(store.state)

    this.app = new Vue({
      el: element,
  	  template: '<Designer/>',
      components: { Designer }
    })
  }
}

// import $ from 'jquery/dist/jquery'
// import 'popper.js/dist/popper'
// import 'bootstrap/dist/js/bootstrap'
// import 'jquery-serializejson/jquery.serializejson'
// import 'jquery-resizable-dom/src/jquery-resizable'
// import * as toastr from 'toastr/toastr'
// /dist/vue.esm.js

// import MediaGallery from '../designer/components/MediaGallery.vue'
// import ElementForm from '../designer/components/ElementForm.vue'
// import MediaGallery from '@/designer/components/MediaGallery.vue'
  // Set globals for erb.js callbacks
  // window.$ = $
  // window.toastr = toastr
  //
  // toastr.options = {
  //   "positionClass": "toast-bottom-right"
  // }
//
// Resizable Panels
// TODO: Use Vue

//
// Markdown Editor

// var $markdown = $('textarea.markdown')
// if ($markdown.length) {
//   let editor = new Editor($markdown[0])
//
//   $('#sidebar [rel="editor"]').click(() => {
//     editor.refresh() // ensure content is redered
//   })
// }
// })

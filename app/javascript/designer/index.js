import $ from 'jquery/dist/jquery'
// import Rails from 'rails-ujs/lib/assets/compiled/rails-ujs'
import 'popper.js/dist/popper'
import 'bootstrap/dist/js/bootstrap'
import 'jquery-serializejson/jquery.serializejson'
import 'jquery-resizable-dom/src/jquery-resizable'
import * as toastr from 'toastr/toastr'
import Vue from 'vue/dist/vue.esm.js'

import MediaGallery from '../designer/components/MediaGallery.vue'
import DefaultForm from '../designer/components/DefaultForm.vue'

import Draggable from 'vuedraggable'
import Helpers from  '../designer/helpers'


export default {
  start() {

    // Set globals for erb.js callbacks
    window.$ = $
    window.toastr = toastr

    toastr.options = {
      "positionClass": "toast-bottom-right"
    }

    // Load the Vue app on DOMContentLoaded
    if (/complete|interactive|loaded/.test(document.readyState)) {
      this.load()
    } else {
      document.addEventListener('DOMContentLoaded', this.load, false)
    }
  },
  load() {
    // document.addEventListener('DOMContentLoaded', () => {

    Vue.use(Helpers)

    this.app = new Vue({
      el: '#app',
      components: {
        MediaGallery, Draggable, DefaultForm
      },
      props: ['elements', 'spec', 'resource_id', 'resource_type', 'resource_path', 'preview_path', 'upload_path'],
      beforeMount() {
        console.log('before mount', this.$attrs, this.$el.dataset.elements, this.$el.dataset.spec)
        const dataset = this.$el.dataset
        for(const key in dataset) {
          this[key] = (dataset[key][0] === '{' || dataset[key][0] === '[') ? JSON.parse(dataset[key]) : dataset[key]
        }
        this.elements = this.filterMetadata()
      },
      data() {
        return {
          showPreview: true
        }
      },
      methods: {
        getSpec(template) {
          return Object.values(this.spec).find(function(item) {
            return item.template == template
          })
        },
        filterMetadata() {
          var self = this
          if (!Array.isArray(this.elements))
            return []
          return this.elements.map(function(item) {
            if (!item.id)
              item.id = item.template + '-' + self.randomString(10)
            const found = Object.values(self.spec).find(function(definition) {
              return definition.template == item.template
            })
            if (found) {
              return item
            } else {
              alert('No template exists for: ' + JSON.stringify(item))
              return null
            }
          }).filter(Boolean)
        },
        addElement(template) {
          this.elements.push({
            id: template + '-' + this.randomString(10),
            template: template,
            values: {}
          })
        },
        save() {
          console.log('saving', this.elements)
          let self = this
          let data = $('#editor form').serializeJSON()
          if (!data || !data.resource)
            data = { resource: {} }
          data.resource.elements = JSON.stringify(this.elements)

          return $.ajax({
            method: 'PATCH',
            url: this.resource_path,
            data: data
          }).done((result) => {
            console.log('saved', result)
            self.refreshPreview()
          })
          // return false
        },
        refreshPreview() {
          document.getElementById('preview').contentWindow.location.reload()
        }
      }
    })

    //
    // Resizable Panels
    // TODO: Use Vue

    $('#sidebar').resizable({
      handleSelector: '.splitter',
      resizeHeight: false
    })

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
  }
}

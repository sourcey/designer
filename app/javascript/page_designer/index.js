import $ from 'jquery/dist/jquery'
import 'popper.js/dist/popper'
import 'bootstrap/dist/js/bootstrap'
import 'jquery-serializejson/jquery.serializejson'
import 'jquery-resizable-dom/src/jquery-resizable'
import * as toastr from 'toastr/toastr'
import Vue from 'vue/dist/vue.esm.js'

// import MediaGallery from '../page_designer/components/MediaGallery.vue'
// import BlockForm from '../page_designer/components/BlockForm.vue'
// import MediaGallery from '@/page_designer/components/MediaGallery.vue'
import MediaGallery from './components/MediaGallery.vue'
import PageForm from './components/PageForm.vue'
import BlockForm from './components/BlockForm.vue'
import ImageInput from './components/ImageInput.vue'


import Draggable from 'vuedraggable'
import Helpers from  './helpers'

// { "label": "Images", "name": "images", "type": "image_array", "validate": { "content_types": [ "jpg", "jpeg", "png" ] } }

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
    Vue.use(Helpers)

    this.app = new Vue({
      el: '#app',
      components: {
        ImageInput, MediaGallery, Draggable, PageForm, BlockForm
      },
      props: ['metadata', 'spec', 'resource_id', 'resource_type', 'resource_path', 'preview_url', 'image_upload_path'],
      beforeMount() {
        console.log('before mount', this.$attrs, this.$el.dataset.metadata, this.$el.dataset.spec)
        const dataset = this.$el.dataset
        for(const key in dataset) {
          this[key] = (dataset[key][0] === '{' || dataset[key][0] === '[') ? JSON.parse(dataset[key]) : dataset[key]
        }
        this.metadata = this.filterMetadata()
      },
      data() {
        return {
          // showPreview: true
        }
      },
      computed: {
        hasPages () {
          return !!this.spec.pages //this.metadata.find(item => !!item.page)
        }
      },
      methods: {
        // getPageSpec(page) {
        //   return this.spec.pages[page]
        //   // return Object.values(this.spec.pages).find(function(item) {
        //   //   return item.page == page
        //   // })
        // },
        // getBlockSpec(template) {
        //   return Object.values(this.spec.blocks).find(function(item) {
        //     return item.template == template
        //   })
        // },
        filterMetadata() {
          var vm = this
          if (!Array.isArray(this.metadata))
            return []
          return this.metadata.map(function(item) {
            if (!item.id)
              item.id = item.template + '-' + vm.randomString(10)

            // Ensure block templates exist
            if (item.template) {
              const found = vm.getBlockSpec(item.template)
              // const found = Object.values(vm.spec).find(function(definition) {
              //   return definition.template == item.template
              // })
              if (found) {
                return item
              } else {
                alert('No template exists for: ' + JSON.stringify(item))
                return null
              }
            } else {
              return item
            }
          }).filter(Boolean)
        },
        addBlock(template) {
          this.metadata.push({
            id: template + '-' + this.randomString(10),
            template: template,
            data: {}
          })
        },
        save() {
          console.log('saving', this.metadata)
          let vm = this
          let data = $('#editor form').serializeJSON()
          if (!data || !data.resource)
            data = { resource: {} }
          data.resource.metadata = JSON.stringify(this.metadata)

          return $.ajax({
            method: 'PATCH',
            url: this.resource_path,
            data: data
          }).done((result) => {
            console.log('saved', result)
            vm.refreshPreview()
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

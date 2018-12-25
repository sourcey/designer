import 'jquery/dist/jquery'
import Rails from 'rails-ujs/lib/assets/compiled/rails-ujs'
import 'popper.js/dist/popper'
import 'bootstrap/dist/js/bootstrap'
import 'jquery-serializejson/jquery.serializejson'
import 'jquery-resizable-dom/src/jquery-resizable'
import * as toastr from 'toastr/toastr'
// import Sortable from 'sortablejs/Sortable'
import Vue from 'vue'
import * as components from '../designer/components/'
import Helpers from  '../designer/helpers'
import Editor from  '../designer/editor'


window.$ = $
window.toastr = toastr

toastr.options = {
  "positionClass": "toast-bottom-right"
}


Vue.filter('formatSize', (size) => {
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

Vue.filter('titleize', (str) => {
  return str.replace(/[A-Z]/g, ' $&').replace(/_/g, ' ').replace(/^./, str => str.toUpperCase())
})


document.addEventListener('DOMContentLoaded', () => {
  Rails.start()

  let app = new Vue({
    el: '#app',
    components: components,
    props: ['elements', 'spec', 'resource_id', 'resource_type', 'resource_path', 'preview_path', 'upload_path'],
    beforeMount() {
      console.log('before mount', this.$attrs, this.$el.dataset.spec)
      const dataset = this.$el.dataset
      for(const key in dataset) {
        this[key] = (dataset[key][0] === '{' || dataset[key][0] === '[') ? JSON.parse(dataset[key]) : dataset[key]
      }
      this.elements = this.filterMetadata()
    },
    data() {
      return {
        currentView: 'preview'
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
            item.id = item.template + '-' + Helpers.randomString(10)
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
          id: template + '-' + Helpers.randomString(10),
          template: template,
          values: {}
        })
      },
      copyToClipboard(text) {
        const dummy = document.createElement('input')
        document.body.appendChild(dummy)
        dummy.value = text
        dummy.select()
        document.execCommand('copy', false)
        dummy.remove()
        toastr.info("Copied!")
        console.log('copied', text)
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
  // Markdown Editor

  var $markdown = $('textarea.markdown')
  if ($markdown.length) {
    let editor = new Editor($markdown[0])

    $('#sidebar [rel="editor"]').click(() => {
      editor.refresh() // ensure content is redered
    })
  }

  //
  // Resizable Panels

  $('#sidebar').resizable({
    handleSelector: '.splitter',
    resizeHeight: false
  })
})

import Vue from 'vue'
import Hooks from  '../hooks'
import { randomString, titleize } from '../utils'
import { store } from '../store'


// Inject reusable component options
export default {
  data () {
    return {
      designerStore: store,
      designerState: store.state
    }
  },
  methods: {
    getLayoutSpec (name) {
      return store.getLayoutSpec(name)
    },

    getElementSpec (name) {
      return store.getElementSpec(name)
    },

    itemId (item) {
      if (!item.id) {
        const name = (item.name || item.type || item.label || item.title).toLowerCase()
        item.id = name + '-' + randomString(10)
      }
      return item.id
    },

    itemLabel (name, spec) {
      if (spec.label)
        return spec.label
      return titleize(name)
    },

    copyToClipboard (text) {
      const dummy = document.createElement('input')
      document.body.appendChild(dummy)
      dummy.value = text
      dummy.select()
      document.execCommand('copy', false)
      dummy.remove()
      this.$toast.success("Copied!")
      // toastr.info("Copied!")
      console.log('copied', text)
    },

    getEmbedCode (itemId) {
      return '<%= designer_embed("' + itemId + '") %>'
    },

    fileMetadata () {
      // return {
      //   designer_element_id: this.item.id
      // }
      const meta = {}
      if (this.parent && this.parent.id) { //this.root &&
        // if (this.root.elements) // TODO: better way of detecting page
        //   meta.designer_page_id = this.root.id
        // if (this.root.id !== this.parent.id)
          meta.designer_element_id = this.parent.id
      }
      // // else if (this.parent) {
      // //   meta.designer_element_id = this.parent.id
      // // }
      // meta.designer_element_id = this.item.id
      return meta
    }
  }
}

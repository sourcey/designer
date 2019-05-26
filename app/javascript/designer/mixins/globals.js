import Vue from 'vue'
import Hooks from  '../hooks'
import SvgIcon from '../components/SvgIcon'
// import { randomString, titleize } from '../utils'
import { store } from '../store'


// Inject reusable component options
export default {
  components: {
    'designer-icon': SvgIcon
  },
  data () {
    return {
      designerStore: store,
      designerState: store.state
    }
  },
  methods: {
    // getLayoutSpec (name) {
    //   return store.getLayoutSpec(name)
    // },
    //
    // getElementSpec (name) {
    //   return store.getElementSpec(name)
    // },

    // itemId (item) {
    //   if (!item.id) {
    //     const name = (item.name || item.type || item.label || item.title).toLowerCase()
    //     item.id = name + '-' + randomString(10)
    //   }
    //   return item.id
    // },

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
    }
  }
}

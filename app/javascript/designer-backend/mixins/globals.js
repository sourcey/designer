import Vue from 'vue'
// import Hooks from  '../hooks'
// import SvgIcon from '../../designer/components/SvgIcon'
// import { randomString, titleize } from '../../designer/utils'
// import { store } from '../store'


// Inject reusable component options
export default {
  // components: {
  //   'icon': SvgIcon
  // },
  // data () {
  //   return {
  //     designerStore: this.$store,
  //     designerBackendState: this.$store.state.designerBackend
  //   }
  // },
  computed: {
    designerBackendState () {
      return this.$store.state.designerBackend
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
    //   if (!object.id) {
    //     const name = (object.name || object.type || object.label || object.title).toLowerCase()
    //     object.id = name + '-' + randomString(10)
    //   }
    //   return object.id
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

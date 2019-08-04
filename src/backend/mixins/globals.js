// import Spinner from '../../base/components/Spinner'
// import SvgIcon from '../../base/components/SvgIcon'
// import Vue from 'vue'
// import IpcServer from '../ipc-server'
// import Hooks from  './hooks'
// import Hooks from  '../hooks'
// import { randomString, titleize } from '../../base/utils'
// import { store } from '../store'


// Inject reusable component options
export default {
  // components: {
  //   'icon': SvgIcon,
  //   'spinner': Spinner
  // },
  // data () {
  //   return {
  //     designerBackendStore: this.$store,
  //     designerBackendState: this.$store.state.designerBackend
  //   }
  // },
  computed: {
    designerBackendStore () {
      return this.$store
    },
    designerBackendState () {
      return this.$store.state.designerBackend
    },
    designerPreviewApp () {
      return this.$store.getters.designerPreviewApp
    },
    designerPreviewStore () {
      if (this.designerPreviewApp)
        return this.designerPreviewApp.$store
    },
    designerPreviewState () {
      if (this.designerPreviewApp)
        return this.designerPreviewApp.$store.state
    },
  },
  methods: {
    // itemId (item) {
    //   if (!object.id) {
    //     const name = (object.name || object.type || object.label || object.title).toLowerCase()
    //     object.id = name + '-' + randomString(10)
    //   }
    //   return object.id
    // },

    // Generic Helpers
    // --------------------------------------------------

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

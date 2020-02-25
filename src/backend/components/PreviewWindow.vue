<template lang="pug">
#preview-window(:class='{"disable-mouse": disableMouse, "expand": $store.getters.designerPreviewExpanded}')
  spinner.my-5(v-if='!loaded')
  iframe(
      :src='url'
      v-show='loaded'
      name='preview'
      ref='iframe'
      width='100%'
      height='100%'
      frameborder='0'
      @load='previewLoaded')
</template>

<script>
export default {
  name: 'preview-window',
  components: {
  },
  props: {
    url: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loaded: false,
      expand: false,
      disableMouse: false,
    }
  },
  computed: {
    // url () {
    //   return `/site-proxy/?subdomain=${this.$store.state.site.subdomain}`
    // },
    // previewApp () {
    //   return this.$store.getters.designerPreviewApp
    // },
    // designerPreviewStore () {
    //   if (this.iframeApp)
    //     return this.iframeApp.$store
    // },
    // designerPreviewState () {
    //   if (this.iframeApp)
    //     return this.iframeApp.$store.state
    // },
  },
  methods: {
    setDragging (flag) {
      this.disableMouse = flag
    },
    reload () {
      this.$refs.iframe.src += ''
    },
    previewLoaded () {
      this.loaded = true

      console.log('designer page: preview loaded', this.$refs.iframe.contentWindow.app)

      try {
        // The internal preview iframe must set a current `window.app` instance
        // to share data with the designer frontend.
        if (this.$refs.iframe.contentWindow.app) {
          this.$store.commit('setPreviewApp', this.$refs.iframe.contentWindow.app)

          // If the preview app has defined an designerPage instance, then set it
          // as the current designer resource.
          console.log('designer page', this.designerPreviewStore.getters.designerPage)
          if (this.designerPreviewStore.getters.designerPage)
            this.$store.commit('setDesignerResource', this.designerPreviewStore.getters.designerPage)
          if (this.designerPreviewState.designer) {
            this.designerPreviewState.designer.backend = this.$parent
            this.designerPreviewState.designer.designerBackendStore = this.designerBackendStore
            this.designerPreviewState.designer.designerSpec = this.designerBackendState.spec
          } else {
            console.warn('The preview designer store has not been initialized.')
          }
        } else {
          console.warn('The preview designer app instance has not been initialized.')
        }
      }
      catch( e ) {
          return false;
      }
    },

    // // Override the designer resource URL parameters for saving attachments
    // // scoped to the current page.
    // setDesignerUrlParameters (page) {
    //   if (page) {
    //     console.log('designer impl: editing page parameters', page)
    //     this.designerBackendState.resourceUrlParameters = {
    //       resource_id: page.id,
    //       resource_name: 'site_pages'
    //     }
    //   } else {
    //     // this.showSidebar = true
    //     this.designerBackendState.resourceUrlParameters = null
    //   }
    // },
    //
    // bindPreviewWatchers () {
    //   console.log('designed impl: bind preview watchers')
    //
    //   // Watch for section editing so we can update the designer URL parameters
    //   this.designerPreviewStore.watch(
    //     (state, getters) => getters.designerEditingSection,
    //     (newValue, oldValue) => {
    //       console.log('designed impl: changed editing section')
    //       const currentPage = this.designerPreviewStore.getters.currentPage
    //
    //       if (newValue !== null) {
    //         // If the page is not saved we need to save it now.
    //         if (!currentPage.id) {
    //           this.savePage(currentPage)
    //               .then(() => { this.setDesignerUrlParameters(currentPage) })
    //         }
    //         else {
    //           this.setDesignerUrlParameters(currentPage)
    //         }
    //       } else {
    //         this.setDesignerUrlParameters(null)
    //       }
    //     }
    //   )
    //
    //   // Watch for page changes which we will sync with the sidebar editor state
    //   this.designerPreviewStore.watch(
    //     (state, getters) => getters.currentPage,
    //     (newValue, oldValue) => {
    //       console.log(`designed impl: changed page from ${oldValue.path} to ${newValue.path}`)
    //
    //       // Start editing the page unless changing to the home page
    //       if (this.$route.path.indexOf('/pages') !== -1 && newValue.path !== '/')
    //         this.setCurrentSidebarPage()
    //         // this.editingPageReference = newValue.referencenewValue.path !== '/' &&
    //
    //     }
    //   )
    // },
    // navigateToPage (path) {
    //   // this.designerApp.$router.push(this.sitePath(page.path))
    //   console.log('designer impl: navigate to', path)
    //   this.iframeApp.$router.push(path)
    // },
    // isEditingPage (reference) {
    //   return this.$route.name === 'designer-pages-edit'
    //       && this.$route.params.reference === reference
    // },
    // setCurrentSidebarPage () {
    //   console.log('designer impl: setCurrentSidebarPage', this.designerPreviewStore.getters.currentPage.reference)
    //   this.$router.push({
    //     name: 'designer-pages-edit',
    //     params: {
    //       reference: this.designerPreviewStore.getters.currentPage.reference
    //     }
    //   })
    // },
    // setPageUnsavedIfCurrent (reference, flag = true) {
    //   if (this.isEditingPage(reference)) {
    //     // this.$refs.sidebar.page &&
    //     this.$store.state.unsaved = flag
    //     // this.currentRoute.components.sidebar.methods.markUnsaved(flag)
    //     // this.$refs.sidebar.markUnsaved(flag)
    //   }
    // },
  }
}
</script>

<style scoped lang="scss">
// @import 'stylesheets/_dashboard-theme';
@import '../assets/styles/_variables.scss';

#preview-window {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: calc(100% - #{$designer-sidebar-width});
  z-index: 300;
  transition: all .5s ease;
  background: white;

  &.expand {
    width: 100%; // calc(100% - #{$sidenav-collapsed-width});
  }
}
iframe {
  display: block;
  border: 0;
}
</style>

<template lang="pug">
#preview-window(:class='{"disable-mouse": disableMouse, "expand": $store.getters.designerPreviewExpanded}')
  spinner(v-if='!previewLoaded')
  iframe(
      :src='url'
      name='preview'
      ref='preview'
      width='100%'
      height='100%'
      frameborder='0'
      @load='previewLoaded')
  //- create-element-dialog(
  //-     v-if='dialogs.createElement'
  //-     :options='dialogs.createElement.options'
  //-     @create='dialogs.createElement.callback'
  //-     @close='$set(dialogs, "createElement", null)'
  //-     @apply='$set(dialogs, "createElement", null)'
  //-     @dragStart='setDragging(true)'
  //-     @dragStop='setDragging(false)')
  //- edit-element-dialog(
  //-     v-if='dialogs.editElement'
  //-     :options='dialogs.editElement.options'
  //-     @close='$set(dialogs, "editElement", null)'
  //-     @apply='$set(dialogs, "editElement", null)'
  //-     @dragStart='setDragging(true)'
  //-     @dragStop='setDragging(false)')
  //-     //- :element='dialogs.editElement.element'
  //- edit-section-dialog(
  //-     v-if='dialogs.editSection'
  //-     :options='dialogs.editSection.options'
  //-     @close='$set(dialogs, "editSection", null)'
  //-     @apply='$set(dialogs, "editSection", null)'
  //-     @dragStart='setDragging(true)'
  //-     @dragStop='setDragging(false)')
  //-     //- :section='dialogs.editSection.section'
  //- //- section-manager-dialog(
  //- //-     v-if='dialogs.manageSections'
  //- //-     :options='dialogs.manageSections.options'
  //- //-     :page='dialogs.manageSections.page'
  //- //-     @close='$set(dialogs, "manageSections", null)'
  //- //-     @apply='$set(dialogs, "manageSections", null)'
  //- //-     @dragStart='setDragging(true)'
  //- //-     @dragStop='setDragging(false)')
  //- select-template-dialog(
  //-     v-if='dialogs.selectTemplate'
  //-     :options='dialogs.selectTemplate.options'
  //-     @select='dialogs.selectTemplate.callback'
  //-     @close='$set(dialogs, "selectTemplate", null)'
  //-     @apply='$set(dialogs, "selectTemplate", null)'
  //-     @dragStart='setDragging(true)'
  //-     @dragStop='setDragging(false)')
  //- social-links-dialog(
  //-     v-if='dialogs.socialLinks'
  //-     :options='dialogs.socialLinks.options'
  //-     @close='$set(dialogs, "socialLinks", null)'
  //-     @apply='$set(dialogs, "socialLinks", null)'
  //-     @dragStart='setDragging(true)'
  //-     @dragStop='setDragging(false)')
  //- //- @select='dialogs.socialLinks.callback'
  //- menu-edit-dialog(
  //-     v-if='dialogs.menu'
  //-     :menuName='dialogs.menu.menuName'
  //-     :options='dialogs.menu.options'
  //-     @close='$set(dialogs, "menu", null)'
  //-     @apply='$set(dialogs, "menu", null)'
  //-     @dragStart='setDragging(true)'
  //-     @dragStop='setDragging(false)')
  //- //- @select='dialogs.menu.callback'
</template>

<script>
// import Spinner from '../Spinner'

// import CreateElementDialog from './dialogs/CreateElementDialog'
// import EditElementDialog from './dialogs/EditElementDialog'
// import EditSectionDialog from './dialogs/EditSectionDialog'
// import SectionManagerDialog from './dialogs/SectionManagerDialog'
// import SelectTemplateDialog from './dialogs/SelectTemplateDialog'
// import SocialLinksDialog from './dialogs/SocialLinksDialog'
// import MenuEditDialog from './dialogs/MenuEditDialog'

import { clone } from '../../designer/utils'
import axios from 'axios'
import Vue from 'vue'

export default {
  name: 'preview-window',
  components: {
    // CreateElementDialog,
    // EditElementDialog,
    // EditSectionDialog,
    // SectionManagerDialog,
    // SelectTemplateDialog,
    // SocialLinksDialog,
    // MenuEditDialog
  },
  props: {
    url: {
      type: String,
      required: true
    },
    // interface: {
    //   type: Object,
    //   // required: true
    // }
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
    //   if (this.previewApp)
    //     return this.previewApp.$store
    // },
    // designerPreviewState () {
    //   if (this.previewApp)
    //     return this.previewApp.$store.state
    // },
  },
  mounted() {
  },
  methods: {
    setDragging (flag) {
      this.disableMouse = flag
    },
    previewLoaded () {
      this.loaded = true

      if (this.$refs.preview.contentWindow.app) {
        this.$store.commit('setPreviewApp', this.$refs.preview.contentWindow.app)

        // If the preview app has defined a designerPage,
        // then set it as the current resource
        if (this.designerPreviewStore.getters.designerPage)
          this.$store.commit('setDesignerResource', this.designerPreviewStore.getters.designerPage)
        this.designerPreviewState.designer.backend = this.$parent
        this.designerPreviewState.designer.designerBackendStore = this.designerBackendStore
        this.designerPreviewState.designer.designerSpec = this.designerBackendState.spec
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
    //   this.previewApp.$router.push(path)
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

<template lang="pug">
#preview-window(:class='{"disable-mouse": disableMouse, "expand": expand}')
  spinner(v-if='!previewLoaded')
  iframe(
      :src='url'
      name='preview'
      ref='preview'
      width='100%'
      height='100%'
      frameborder='0'
      @load='previewLoaded')
  create-element-dialog(
      v-if='dialogs.createElement'
      :options='dialogs.createElement.options'
      @create='dialogs.createElement.callback'
      @close='$set(dialogs, "createElement", null)'
      @apply='$set(dialogs, "createElement", null)'
      @dragStart='setDragging(true)'
      @dragStop='setDragging(false)')
  edit-element-dialog(
      v-if='dialogs.editElement'
      :options='dialogs.editElement.options'
      @close='$set(dialogs, "editElement", null)'
      @apply='$set(dialogs, "editElement", null)'
      @dragStart='setDragging(true)'
      @dragStop='setDragging(false)')
      //- :element='dialogs.editElement.element'
  edit-section-dialog(
      v-if='dialogs.editSection'
      :options='dialogs.editSection.options'
      @close='$set(dialogs, "editSection", null)'
      @apply='$set(dialogs, "editSection", null)'
      @dragStart='setDragging(true)'
      @dragStop='setDragging(false)')
      //- :section='dialogs.editSection.section'
  //- section-manager-dialog(
  //-     v-if='dialogs.manageSections'
  //-     :options='dialogs.manageSections.options'
  //-     :page='dialogs.manageSections.page'
  //-     @close='$set(dialogs, "manageSections", null)'
  //-     @apply='$set(dialogs, "manageSections", null)'
  //-     @dragStart='setDragging(true)'
  //-     @dragStop='setDragging(false)')
  select-template-dialog(
      v-if='dialogs.selectTemplate'
      :options='dialogs.selectTemplate.options'
      @select='dialogs.selectTemplate.callback'
      @close='$set(dialogs, "selectTemplate", null)'
      @apply='$set(dialogs, "selectTemplate", null)'
      @dragStart='setDragging(true)'
      @dragStop='setDragging(false)')
  social-links-dialog(
      v-if='dialogs.socialLinks'
      :options='dialogs.socialLinks.options'
      @close='$set(dialogs, "socialLinks", null)'
      @apply='$set(dialogs, "socialLinks", null)'
      @dragStart='setDragging(true)'
      @dragStop='setDragging(false)')
  //- @select='dialogs.socialLinks.callback'
  menu-edit-dialog(
      v-if='dialogs.menu'
      :menuName='dialogs.menu.menuName'
      :options='dialogs.menu.options'
      @close='$set(dialogs, "menu", null)'
      @apply='$set(dialogs, "menu", null)'
      @dragStart='setDragging(true)'
      @dragStop='setDragging(false)')
  //- @select='dialogs.menu.callback'
</template>

<script>
// import Spinner from '../Spinner'

import CreateElementDialog from './dialogs/CreateElementDialog'
import EditElementDialog from './dialogs/EditElementDialog'
import EditSectionDialog from './dialogs/EditSectionDialog'
import SectionManagerDialog from './dialogs/SectionManagerDialog'
import SelectTemplateDialog from './dialogs/SelectTemplateDialog'
import SocialLinksDialog from './dialogs/SocialLinksDialog'
import MenuEditDialog from './dialogs/MenuEditDialog'

import { clone } from '../../designer/utils'
import axios from 'axios'
import Vue from 'vue'

export default {
  name: 'preview-window',
  components: {
    CreateElementDialog,
    EditElementDialog,
    EditSectionDialog,
    SectionManagerDialog,
    SelectTemplateDialog,
    SocialLinksDialog,
    MenuEditDialog
  },
  props: {
    url: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loaded: false,
      expand: false,
      disableMouse: false,
      dialogs: {},
    }
  },
  computed: {
    // url () {
    //   return `/site-proxy/?subdomain=${this.$store.state.site.subdomain}`
    // },
    previewApp () {
      if (this.loaded)
        return this.$refs.preview.contentWindow.app
    },
    previewStore () {
      if (this.loaded)
        return this.previewApp.$store
    },
    previewState () {
      if (this.loaded)
        return this.previewApp.$store.state
    },
  },
  mounted() {
  },
  methods: {
    setDragging (flag) {
      this.disableMouse = flag
    },
    previewLoaded () {
      this.loaded = true
      console.log('site preview loaded', this.previewApp)
      this.previewState.designerBackend = this
      this.previewState.designerStore = this.designerBackendStore
      this.previewState.designerSpec = this.designerBackendState.spec
      // this.designerBackendState.url = `//${this.$store.state.site.subdomain}.${process.env.SITE_HOST}`
      this.$store.commit('setPreviewApp', this.previewApp)
      // this.bindPreviewWatchers()
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
    //   this.previewStore.watch(
    //     (state, getters) => getters.designerEditingSection,
    //     (newValue, oldValue) => {
    //       console.log('designed impl: changed editing section')
    //       const currentPage = this.previewStore.getters.currentPage
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
    //   this.previewStore.watch(
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
    //   console.log('designer impl: setCurrentSidebarPage', this.previewStore.getters.currentPage.reference)
    //   this.$router.push({
    //     name: 'designer-pages-edit',
    //     params: {
    //       reference: this.previewStore.getters.currentPage.reference
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


    //
    // Backend implementation
    // --------------------------------------------------

    savePage (page) {
      console.log('designed impl: save page', page)

      // Update or create the page
      // if (page.id) {
      //   return axios.patch(this.routes.dashboardSitePage(page.id), {
      //     site_page: page
      //   }).then(response => {
      //     console.log('designed impl: update page success', response.data)
      //     // this.$set(page, 'unsaved', false)
      //     this.setPageUnsavedIfCurrent(page.reference, false)
      //     this.$toast.success("Page saved successfuly!")
      //   })
      // } else {
      //   return axios.post(this.routes.dashboardSitePages(), {
      //     site_page: page
      //   }).then(response => {
      //     this.$set(page, 'id', response.data.id)
      //     this.setPageUnsavedIfCurrent(page.reference, false)
      //     // this.$set(page, 'unsaved', false)
      //     console.log('designed impl: create page success', response.data)
      //     this.$toast.success("Page saved successfuly!")
      //   })
      // }
    },
    saveResource () {
      // axios.patch(this.routes.dashboardSite(), this.previewState.site)
      // return axios.patch(this.routes.dashboardSite(), this.$store.state.site)
    },
    expandPreview (flag) {
      this.expand = flag

      // if (flag)
      //   setTimeout(() => { this.setCurrentSidebarPage() }, 500)
    },
    createElement (event, callback) {
      console.log('designed impl: create element', event)

      this.$set(this.dialogs, 'createElement', null)
      this.$nextTick(() => {
        this.$set(this.dialogs, 'createElement', {
          callback: (element) => {
            console.log('designed impl: element created', element)

            callback(clone(element))
            this.$set(this.dialogs, 'createElement', null)
          },
          options: {
            x: event.clientX + 100,
            y: event.clientY,
            width: 350,
            overlay: false
          }
        })
      })
    },
    createElementData (name) {
      return this.designerBackendStore.createElementData(name)
      console.log('designed impl: create element', element)
    },
    selectTemplate (event, callback) {
      console.log('designed impl: select layout', event)

      this.$set(this.dialogs, 'selectTemplate', null)
      this.$nextTick(() => {
        this.$set(this.dialogs, 'selectTemplate', {
          callback: (layout) => {
            console.log('designed impl: layout selected', layout)

            callback(layout)
            this.$set(this.dialogs, 'selectTemplate', null)
          },
          options: {
            x: event.clientX + 100,
            y: event.clientY,
            width: 350,
            overlay: false
          }
        })
      })
    },
    editElement (event, element) { //spec, , meta
      console.log('designed impl: edit element', event, element)

      this.$set(this.dialogs, 'editElement', {
        // element: element,
        options: {
          x: event.clientX + 100,
          y: event.clientY,
          width: 350,
          overlay: false
        }
      })
    },
    editSection (event, section) {
      console.log('designed impl: edit section settings', event, section)

      // const ComponentClass = Vue.extend(EditSectionDialog)
      // const instance = new ComponentClass({
      //   store: this.previewApp.$store,
      //   propsData: { section: section }
      // })
      // instance.$mount() // pass nothing
      // this.$el.appendChild(instance.$el)

      this.$set(this.dialogs, 'editSection', {
        // section: { beep: section.id },
        options: {
          x: event.clientX + 100,
          y: event.clientY,
          width: 350,
          overlay: false
        }
      })
    },
    editSocialLinks (event) {
      console.log('designed impl: edit social links', event)

      this.$set(this.dialogs, 'socialLinks', {
        options: {
          x: event.clientX + 100,
          y: event.clientY,
          width: 350,
          overlay: false
        }
      })
    },
    editMenu (event, menuName) {
      console.log('designed impl: edit menu', event, menuName)

      this.$set(this.dialogs, 'menu', {
        menuName: menuName,
        options: {
          x: event.clientX + 100,
          y: event.clientY,
          width: 350,
          overlay: false
        }
      })
    },
    editPageSections (event, page) {
      console.log('designed impl: edit page sections', event, page)

      this.$set(this.dialogs, 'manageSections', {
        page: page,
        options: {
          x: event.clientX + 100,
          y: event.clientY,
          width: 350
        }
      })
    },
    // createPage (event) {
    //   this.selectTemplate(event, (template) => {
    //     const page = this.designerBackendStore.createDefaultPage(template)
    //
    //     // Set the unique page reference if not already set.
    //     // The reference is used to identify the page for navigaton and sorting.
    //     // Page references are the page name followed by an ascending numerical
    //     // suffix for duplicates. This allows us to identify the page even before
    //     // it has been saved for navigation and sorting.
    //     const duplicates = this.previewState.site.pages.filter(x => x.name === page.name)
    //     if (duplicates.length) {
    //       page.reference = `${page.name}-${duplicates.length}`
    //     } else {
    //       page.reference = page.name
    //     }
    //     console.log('designed impl: created page', page)
    //
    //     // Add via the site store so page paths can be setup for routing
    //     this.previewStore.commit('updatePagePath', page)
    //     this.previewStore.commit('addPage', page)
    //
    //     // Set the current page to the new page and navigate to it
    //     this.navigateToPage(page.path) // = page.reference
    //   })
    // },
    // removePage (page) {
    //   if (confirm("Are you sure? All existing page data will be lost.")) {
    //
    //     // Navigate home if we are deleting the current page
    //     if (this.isEditingPage(page.reference))
    //       this.navigateToPage('/')
    //
    //     // Only delete the page from the API if it was previously saved
    //     if (page.id) {
    //       axios.delete(this.routes.dashboardSitePage(page.id)).then(response => {
    //         console.log('designed impl: update page success', response.data)
    //         this.$toast.success("Page deleted successfuly!")
    //       })
    //     }
    //
    //     // Remove the page from the site preview store
    //     this.previewStore.commit('removePage', page)
    //
    //     // NOTE: This fixes reactivity issues where sidebar pages arent updating
    //     // after page is removed from preview store
    //     this.$forceUpdate()
    //   }
    // },
    insertPageSection (event, page, index) {
      console.log('designed impl: insert page section', event, page, index)
      return new Promise((resolve, reject) => {
        this.selectTemplate(event, (template) => {
          // this.setPageUnsavedIfCurrent(page.reference, true)
          // this.setCurrentSidebarPage()

          const section = this.designerBackendStore.createSection(page, template, index)
          resolve(section)
        })
      })
    },
    removePageSection (page, sectionId) {
      if (confirm("Are you sure?")) {
        this.previewStore.commit('removeSection', {
          page: page,
          sectionId: sectionId
        })

        // // Ensure the page form section list is updated
        // this.setPageUnsavedIfCurrent(page.reference, true)
        // this.setCurrentSidebarPage()
        return true
      }
    }
  }
}
</script>

<style scoped lang="scss">
// @import 'stylesheets/_dashboard-theme';

#preview-window {
  // position: absolute;
  // top: 0;
  // right: 0;
  // bottom: 0;
  // width: calc(100% - #{$sidenav-collapsed-width + $sidebar-default-width});
  z-index: 300;
  transition: all .5s ease;

  &.expand {
    width: 100%; // calc(100% - #{$sidenav-collapsed-width});
  }
}
iframe {
  display: block;
  border: 0;
}
</style>

import Vue from 'vue'
import CreateElementDialog from '../components/dialogs/CreateElementDialog'
import EditElementDialog from '../components/dialogs/EditElementDialog'
import EditSectionDialog from '../components/dialogs/EditSectionDialog'
import SectionManagerDialog from '../components/dialogs/SectionManagerDialog'
import SelectTemplateDialog from '../components/dialogs/SelectTemplateDialog'
import SocialLinksDialog from '../components/dialogs/SocialLinksDialog'
import MenuEditDialog from '../components/dialogs/MenuEditDialog'
import IpcServer from '../ipc-server'
import Attachments from './attachments'
import { randomString, mergeSpecDefaults, sortItemsBy } from '../../base/utils'


// Backend command interface which will be exposed to the frontent.
export default {
  data () {
    return {
      dialogs: {}
    }
  },
  mixins: [
    Attachments
  ],
  computed: {
    // url () {
    //   return `/site-proxy/?subdomain=${this.$store.state.site.subdomain}`
    // },
    previewApp () {
      // if (this.loaded)
        // return this.$refs.preview.contentWindow.app
      return this.$store.getters.designerPreviewApp
    },
    designerPreviewStore () {
      if (this.previewApp)
        return this.previewApp.$store
    },
    designerPreviewState () {
      if (this.previewApp)
        return this.previewApp.$store.state
    },
  },
  methods: {
    // savePage (page) {
    //   console.log('designer backend: save page', page)
    //
    //   // Update or create the page
    //   // if (page.id) {
    //   //   return axios.patch(this.routes.dashboardSitePage(page.id), {
    //   //     site_page: page
    //   //   }).then(response => {
    //   //     console.log('designer backend: update page success', response.data)
    //   //     // this.$set(page, 'unsaved', false)
    //   //     this.setPageUnsavedIfCurrent(page.reference, false)
    //   //     this.$toast.success("Page saved successfuly!")
    //   //   })
    //   // } else {
    //   //   return axios.post(this.routes.dashboardSitePages(), {
    //   //     site_page: page
    //   //   }).then(response => {
    //   //     this.$set(page, 'id', response.data.id)
    //   //     this.setPageUnsavedIfCurrent(page.reference, false)
    //   //     // this.$set(page, 'unsaved', false)
    //   //     console.log('designer backend: create page success', response.data)
    //   //     this.$toast.success("Page saved successfuly!")
    //   //   })
    //   // }
    // },
    saveResource () {
      // axios.patch(this.routes.dashboardSite(), this.designerPreviewState.site)
      // return axios.patch(this.routes.dashboardSite(), this.$store.state.site)

      this.$store.dispatch('saveResource')
        .then(() => {
          if (this.designerBackendState.enableRefresh && this.refreshPreview)
            this.refreshPreview()
        })
    },
    markUnsaved (flag = true) {
      this.$store.state.unsaved = flag
      this.$forceUpdate()
    },
    expandPreview (flag) {
      this.$store.commit('setPreviewExpanded', flag)

      // if (flag)
      //   setTimeout(() => { this.setCurrentSidebarPage() }, 500)
    },

    // importCustomElement (name) {
    //   let component = false
    //   this.$emit('import-element', name, component)
    //   return component
    // },

    // createElementData (name) {
    //   return this.designerBackendStore.createElementData(name)
    //   console.log('designer backend: create element', element)
    // },
    closeDialog (name) {
      const instance = this.dialogs[name]
      if (instance) {
        instance.$destroy()
        this.$el.removeChild(instance.$el)
        delete this.dialogs[name]
      }
    },
    openDialog (name, clazz, event, propsData) {
      if (!propsData) propsData = {}
      if (!propsData.options) propsData.options = {}
      propsData.options = Object.assign({
        x: event.clientX + 100,
        y: event.clientY,
        width: 350,
        overlay: false
      }, propsData.options)
      this.closeDialog(name)
      const ComponentClass = Vue.extend(clazz)
      const store = this.$store
      const instance = new ComponentClass({
          store,
          propsData: propsData
      })
      instance.$on('close', () => this.closeDialog(name))
      instance.$on('apply', () => this.closeDialog(name))
      instance.$mount() // pass nothing
      this.$el.appendChild(instance.$el)
      this.dialogs[name] = instance
      return instance
    },
    createElementDialog (event, resource, callback) {
      console.log('designer backend: create element', event)

      const dialog = this.openDialog('create-element', CreateElementDialog, event, { resource })
      if (callback)
        dialog.$on('apply', callback)
      // this.$set(this.dialogs, 'createResourceElement', null)
      // this.$nextTick(() => {
      //   this.$set(this.dialogs, 'createResourceElement', {
      //     callback: (element) => {
      //       console.log('designer backend: element created', element)
      //
      //       callback(clone(element))
      //       this.$set(this.dialogs, 'createResourceElement', null)
      //     },
      //     options: {
      //       x: event.clientX + 100,
      //       y: event.clientY,
      //       width: 350,
      //       overlay: false
      //     }
      //   })
      // })
    },
    selectTemplateDialog (event, callback) {
      console.log('designer backend: select layout', event)
      const dialog = this.openDialog('select-template', SelectTemplateDialog, event)
      dialog.$on('apply', callback)

      // this.$set(this.dialogs, 'selectTemplateDialog', null)
      // this.$nextTick(() => {
      //   this.$set(this.dialogs, 'selectTemplateDialog', {
      //     callback: (layout) => {
      //       console.log('designer backend: layout selected', layout)
      //
      //       callback(layout)
      //       this.$set(this.dialogs, 'selectTemplateDialog', null)
      //     },
      //     options: {
      //       x: event.clientX + 100,
      //       y: event.clientY,
      //       width: 350,
      //       overlay: false
      //     }
      //   })
      // })
    },
    editElementDialog (event, element) { //spec, , meta
      console.log('designer backend: edit element', event, element)
      this.openDialog('edit-element', EditElementDialog, event)
    },
    editSectionDialog (event, section) {
      console.log('designer backend: edit section settings', event, section)
      this.openDialog('edit-section', EditSectionDialog, event)

      // this.$set(this.dialogs, 'editSectionDialog', {
      //   // section: { beep: section.id },
      //   options: {
      //     x: event.clientX + 100,
      //     y: event.clientY,
      //     width: 350,
      //     overlay: false
      //   }
      // })
    },
    editSocialLinksDialog (event) {
      console.log('designer backend: edit social links', event)
      this.openDialog('social-links', SocialLinksDialog, event)

      // this.$set(this.dialogs, 'socialLinks', {
      //   options: {
      //     x: event.clientX + 100,
      //     y: event.clientY,
      //     width: 350,
      //     overlay: false
      //   }
      // })
    },
    editMenuDialog (event, menuName) {
      console.log('designer backend: edit menu', event, menuName)

      this.openDialog('menu', MenuEditDialog, event)
      // this.$set(this.dialogs, 'menu', {
      //   menuName: menuName,
      //   options: {
      //     x: event.clientX + 100,
      //     y: event.clientY,
      //     width: 350,
      //     overlay: false
      //   }
      // })
    },
    editPageSectionsDialog (event, page) {
      console.log('designer backend: edit page sections', event, page)

      this.openDialog('menu', SectionManagerDialog, event, { page })
      // this.$set(this.dialogs, 'manageSections', {
      //   page: page,
      //   options: {
      //     x: event.clientX + 100,
      //     y: event.clientY,
      //     width: 350
      //   }
      // })
    },
    // createPage (event) {
    //   this.selectTemplateDialog(event, (template) => {
    //     const page = this.designerBackendStore.createDefaultPage(template)
    //
    //     // Set the unique page reference if not already set.
    //     // The reference is used to identify the page for navigaton and sorting.
    //     // Page references are the page name followed by an ascending numerical
    //     // suffix for duplicates. This allows us to identify the page even before
    //     // it has been saved for navigation and sorting.
    //     const duplicates = this.designerPreviewState.site.pages.filter(x => x.name === page.name)
    //     if (duplicates.length) {
    //       page.reference = `${page.name}-${duplicates.length}`
    //     } else {
    //       page.reference = page.name
    //     }
    //     console.log('designer backend: created page', page)
    //
    //     // Add via the site store so page paths can be setup for routing
    //     this.designerPreviewStore.commit('updatePagePath', page)
    //     this.designerPreviewStore.commit('addPage', page)
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
    //         console.log('designer backend: update page success', response.data)
    //         this.$toast.success("Page deleted successfuly!")
    //       })
    //     }
    //
    //     // Remove the page from the site preview store
    //     this.designerPreviewStore.commit('removePage', page)
    //
    //     // NOTE: This fixes reactivity issues where sidebar pages arent updating
    //     // after page is removed from preview store
    //     this.$forceUpdate()
    //   }
    // },
    createPageSectionDialog (event, page, index) {
      console.log('designer backend: insert page section', event, page, index)
      return new Promise((resolve, reject) => {
        this.selectTemplateDialog(event, (template) => {
          // this.setPageUnsavedIfCurrent(page.reference, true)
          // this.setCurrentSidebarPage()
          console.log('designer backend: selected template', template)

          this.markUnsaved() // update after preview store is updated

          const section = this.createSection(page, template, index)
          // .designerBackendStore
          resolve(section)
        })
      })
    },


    // Spec Mutations
    // --------------------------------------------------

    createDefaultPageData () {
      for (let name in this.designerBackendState.spec.pages) {
        if (this.designerBackendState.spec.pages[name].creatable)
          return this.createPageData(name)
      }
      throw Error('Spec has no creatable pages')
      // const name = Object.values(this.designerBackendState.spec.pages).find(x => x.creatable)
      // return this.createPageData(name)
    },

    // createPageData (name) {
    //   const spec = this.getPageSpec(name)
    //   // console.log('createDefaultPageData spec', spec)
    //   const page = {
    //     // id: name + '-' + randomString(10),
    //     name: name,
    //     data: spec.data ? spec.data : {},
    //     content: spec.content ? spec.content : [],
    //   }
    //
    //   // Ensure default elements have IDs and a `data` object so they are
    //   // fully reactive
    //   // data.elements.forEach(item => {
    //   //   if (!item.id)
    //   //     item.id = item.name + '-' + randomString(10)
    //   //   // this.itemId(item)
    //   //   if (!item.data)
    //   //     item.data = {}
    //   // })
    //
    //   // Execute create actions
    //   // Hooks.executeCreate (spec, data.data)
    //   mergeSpecDefaults(page, spec)
    //   delete page.id // remove id set by mergeSpecDefaults
    //
    //   if (page.content.length) {
    //     page.content.forEach(section => {
    //       this.processItems(section.items)
    //     })
    //   }
    //
    //   return clone(page)
    // },
    //
    // createDefaultPage (templateName) {
    //   // NOTE: We only support a single creatable page type per spec
    //   const page = this.createDefaultPageData()
    //   if (templateName) {
    //     const section = this.createSectionData(page, templateName)
    //     page.content = [ section ]
    //   }
    //   console.log('createDefaultPage', page)
    //   // this.$store.getters.state.content.push(page)
    //   // this.$store.getters.state.unsaved = true
    //   // IpcServer.postPreviewMessage('createPage', page)
    //   return page
    // },

    createSectionData (templateName) {
      const templateSpec = this.$store.getters.getTemplateSpec(templateName)
      const section = {
        label: 'New Section',
        items: templateSpec.items && templateSpec.items.length ? templateSpec.items : [],
        data: {}
      }

      // templateSpec ? templateSpec.items : []

      // Merge spec defaults into element data
      // const spec = this.$store.getters.getLayoutSpec(layout)

      // Add all template values to the section
      mergeSpecDefaults(section, templateSpec)

      // Process all template elements and set defaults
      this.processItems(section.items)
      return section
    },

    createSection (page, templateName, index = -1) {
      const section = this.createSectionData(templateName)
      if (index === -1)
        page.content.push(section)
      else
        page.content.splice(index, 0, section)
      page.content = [...page.content] // force reactivity
      return section
    },

    removePageSection (page, sectionId) {
      if (confirm("Are you sure?")) {
        IpcServer.postPreviewMessage('removeSection', {
          id: page.id,
          sectionId: sectionId
        })

        if (this.designerPreviewStore)
          this.designerPreviewStore.commit('removeDesignerSection', sectionId)

        this.markUnsaved() // update after preview store is updated

        // // Ensure the page form section list is updated
        // this.setPageUnsavedIfCurrent(page.reference, true)
        // this.setCurrentSidebarPage()
        return true
      }
    },

    createElementData (name) { // , section, data
      const spec = this.$store.getters.getElementSpec(name)
      const element = {
        id: name + '-' + randomString(10),
        name: name,
        // template: spec.template,
        // section: section,
        // data: Object.assign({}, spec.data, data)
      }

      // Merge spec defaults into element data
      mergeSpecDefaults(element, spec)

      // Execute create actions
      // Hooks.executeCreate (spec, element)
      return element
    },

    // Create a root level element
    createResourceElement (resource, name, index = -1) { //, section
      const element = this.createElementData(name) //, section
      console.log('createResourceElement', name, element, resource) //, section
      if (index === -1)
        resource.content.push(element)
      else
        resource.content.splice(index, 0, element)
      // section.content = [...section.content] // force reactivity

      // if (section && section.content) {
      //   section.content.push(element)
      //   // this.designerBackendState.resource.content = [...this.designerBackendState.resource.content] // force reactivity
      // }
      this.markUnsaved()
      // IpcServer.postPreviewMessage('createElement', element)
      IpcServer.postPreviewMessage('createElement', {
        id: resource.id,
        element: element
      })
      return element
    },

    removeResourceElement (resource, element) {
      console.log('removeResourceElement', resource, element) //, section
      if (confirm("Are you sure?")) {
        resource.content.splice(
          resource.content.findIndex(x => x.id === element.id), 1)
        // Hooks.executeDeleteElement(this.designerBackendStore.getters.getElementSpec(element.name), element)
        IpcServer.postPreviewMessage('removeElement', {
          id: resource.id,
          elementId: element.id
        })

        this.markUnsaved() // update after preview store is updated

        // // Ensure the page form section list is updated
        // this.setPageUnsavedIfCurrent(page.reference, true)
        // this.setCurrentSidebarPage()
        return true
      }
    },

    // createSection (page, templateName, index = -1) {
    //   const section = this.createSectionData(page, templateName)
    //   if (index === -1)
    //     page.content.push(section)
    //   else
    //     page.content.splice(index, 0, section)
    //   page.content = [...page.content] // force reactivity
    //   return section
    // },

    // Process items recursively
    processItems (items) { //, config
      //   return unless items.present?
      //   items.each do |item|
      //     if item['type'] == 'element'
      //       merge_layout_defaults item, config, 'element_default'
      //       process_element item, config
      //     end
      //     if item['type'] == 'row' && item['columns'].present?
      //       item['columns'].each do |column|
      //         process_grid column['items'], config
      //       end
      //     end
      //   end
      // end
      // console.log('processItems', items)
      if (!items || !items.length)
        return

      items.forEach(item => {
        if (item.type === 'element') {
          const elementSpec = this.$store.getters.getElementSpec(item.name)
          mergeSpecDefaults(item, elementSpec)
          this.processItems(item.items)
        } else if (item.type === 'row' && item.columns && item.columns.length) {
          item.columns.forEach(column => {
            this.processItems(column.items)
          })
        }
      })
    },
  }
}

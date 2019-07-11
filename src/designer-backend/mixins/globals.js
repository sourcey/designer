import Vue from 'vue'
import IpcServer from '../ipc-server'
// import Hooks from  './hooks'
import { randomString, mergeSpecDefaults, sortItemsBy } from '../../designer/utils'
// import Hooks from  '../hooks'
import Spinner from '../../designer/components/Spinner'
import SvgIcon from '../../designer/components/SvgIcon'
// import { randomString, titleize } from '../../designer/utils'
// import { store } from '../store'


// Inject reusable component options
export default {
  components: {
    'icon': SvgIcon,
    'spinner': Spinner
  },
  // data () {
  //   return {
  //     designerBackendStore: this.$store,
  //     designerBackendState: this.$store.state.designerBackend
  //   }
  // },
  computed: {
    designerBackendState () {
      return this.$store.state.designerBackend
    },
    designerBackendStore () {
      return this.$store
    },
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

    createPageData (name) {
      const spec = this.getPageSpec(name)
      // console.log('createDefaultPageData spec', spec)
      const page = {
        // id: name + '-' + randomString(10),
        name: name,
        data: spec.data ? spec.data : {},
        sections: spec.sections ? spec.sections : [],
      }

      // Ensure default elements have IDs and a `data` object so they are
      // fully reactive
      // data.elements.forEach(item => {
      //   if (!item.id)
      //     item.id = item.name + '-' + randomString(10)
      //   // this.itemId(item)
      //   if (!item.data)
      //     item.data = {}
      // })

      // Execute create actions
      // Hooks.executeCreate (spec, data.data)
      mergeSpecDefaults(page, spec)
      delete page.id // remove id set by mergeSpecDefaults

      if (page.sections.length) {
        page.sections.forEach(section => {
          store.processItems(section.items)
        })
      }

      return clone(page)
    },

    createDefaultPage (templateName) {
      // NOTE: We only support a single creatable page type per spec
      const page = this.createDefaultPageData()
      if (templateName) {
        const section = store.createSectionData (page, templateName)
        page.sections = [ section ]
      }
      console.log('createDefaultPage', page)
      // store.state.metadata.push(page)
      // store.state.unsaved = true
      // IpcServer.postPreviewMessage('createPage', page)
      return page
    },

    createSectionData (page, templateName) {
      const templateSpec = store.getTemplateSpec(templateName)
      const section = {
        label: 'New Section',
        items: templateSpec.items && templateSpec.items.length ? templateSpec.items : [],
        data: {}
      }

      // templateSpec ? templateSpec.items : []

      // Merge spec defaults into element data
      // const spec = store.getLayoutSpec(layout)

      // Add all template values to the section
      mergeSpecDefaults(section, templateSpec)

      // Process all template elements and set defaults
      store.processItems(section.items)
      return section
    },

    createSection (page, templateName, index = -1) {
      const section = store.createSectionData(page, templateName)
      if (index === -1)
        page.sections.push(section)
      else
        page.sections.splice(index, 0, section)
      page.sections = [...page.sections] // force reactivity
      return section
    },

    createElementData (name, section, data) {
      const spec = this.getElementSpec(name)
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
    createElement (name, section) {
      const element = this.createElementData(name, section)
      console.log('createElement', name, section, element)
      state.metadata.push(element)
      state.unsaved = true
      IpcServer.postPreviewMessage('createElement', element)
      return element
    },

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

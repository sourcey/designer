import Vue from 'vue'

export default {
  state: {
    enabled: true,
    backend: null,
    designerPage: null,
    dragging: false,
    resizing: false,
    editingSection: null,
    editingElement: null,
    designerStore: null,
    designerSpec: null,
  },

  mutations: {

    setDesignerPage (state, page) {
      console.log('designer frontend store: set page', page)
      // Vue.set(state, 'designerPage', page)
      state.designerPage = page
    },

    setDesignerEditingSection (state, section) {
      console.log('designer frontend store: set editing section', section)
      // Vue.set(state, 'designerPage', page)
      state.editingSection = section
    },

    setDesignerEditingElement (state, element) {
      console.log('designer frontend store: set editing element', element)
      // Vue.set(state, 'designerPage', page)
      state.editingElement = element
    },

    removeDesignerSection (state, sectionId) {
      // const page = state.site.pages.find(x => x.id === params.pageId)
      // const index = page.sections.findIndex(x => x.id === params.sectionId)
      // if (index !== -1)
      //   page.sections.splice(index, 1)
      // const index = params.page.sections.findIndex(x => x.id === params.sectionId)
      // // if (index !== -1)
      // console.log('store: remove section', params, index)
      // params.page.sections.splice(index, 1)
      const index = state.designerPage.content.findIndex(x => x.id === sectionId)
      console.log('designer frontend store: remove section', index, sectionId, state.designerPage.content)
      if (index !== -1)
        state.designerPage.content.splice(index, 1)

      // NOTE: Resetting the array will not trigger updates across iframe boundaries
      state.designerPage.content = [...state.designerPage.content]
    },
  },

  getters: {

    isEditingSection: (state) => (id) => {
      return state.editingSection && state.editingSection.id === id
    },

    isEditingElement: (state) => (id) => {
      return state.editingElement && state.editingElement.id === id
    },

    designerPage: (state) => {
      return state.designerPage
    },

    designerEnabled: (state) => {
      return state.enabled
    },

    designerBackend: (state) => {
      return state.backend
    },

    // Required for use with backend attachments mixin
    designerBackendStore: (state) => {
      return state.backend.designerBackendStore
    },

    designerBackendState: (state) => {
      return state.backend.designerBackendState
    },

    designerDragging: (state) => {
      return state.dragging
    },

    designerResizing: (state) => {
      return state.resizing
    },

    designerEditingSection: (state) => {
      return state.editingSection
    },

    designerEditingElement: (state) => {
      return state.editingElement
    },

    designerElementSpec: (state) => (name) => {
      if (state.designerSpec && state.designerSpec.elements)
        return state.designerSpec.elements[name] //.find(x => x.type === type)
    },

    designerLayoutSpec: (state) => (name) => {
      if (state.designerSpec && state.designerSpec.layouts)
        return state.designerSpec.layouts[name] //.find(x => x.type === type)
    },

    designerLayoutSpec: (state) => (name) => {
      if (state.designerSpec && state.designerSpec.layouts)
        return state.designerSpec.layouts[name] //.find(x => x.type === type)
    }
  }
}

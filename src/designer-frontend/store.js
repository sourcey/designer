import Vue from 'vue'

export default {
  state: {
    designerEnabled: true,
    designerBackend: null,
    designerPage: null,
    designerDragging: false,
    designerResizing: false,
    designerEditingSection: null,
    designerEditingElement: null,
    designerStore: null,
  },

  mutations: {

    setDesignerPage (state, page) {
      console.log('designer frontend store: set page', page)
      // Vue.set(state, 'designerPage', page)
      state.designerPage = page
    },
  },

  getters: {

    isEditingSection: (state) => (id) => {
      return state.designerEditingSection && state.designerEditingSection.section.id === id
    },

    designerPage: (state) => {
      // if (state.designer)
      return state.designerPage
    },

    designerDragging: (state) => {
      return state.designerDragging
    },

    designerResizing: (state) => {
      return state.designerResizing
    },

    designerEditingSection: (state) => {
      return state.designerEditingSection
    },

    designerEditingElement: (state) => {
      return state.designerEditingElement
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

import Vue from 'vue'
import IpcServer from './ipc-server'
import { randomString, mergeSpecDefaults, sortItemsBy } from '../designer/utils'
import axios from 'axios'

export default {
  state: {
    // Data
    spec: {},
    resource: {},
    metadata: [],
    validationErrors: {},
    attachmentMetadata: {},

    // Options
    // enable_pages: false,
    enableGallery: false,
    enableElementEmbeds: false,
    enableRefresh: false,
    googleFontsApiKey: null,
    resourceUrlParameters: null,

    // Attachemnt URLs
    attachmentUploadPathTemplate: null,
    attachmentDeletePathTemplate: null,
    attachmentThumbnailPathTemplate: null,
    attachmentPreviewAssetPathTemplate: null,
    attachmentCdnUrlTemplate: null,

    previewApp: null
  },

  // Mutations
  // --------------------------------------------------

  mutations: {

    setPreviewApp (state, instance) {
      Vue.set(state, 'previewApp', instance)
    },

  },


  // Actions
  // --------------------------------------------------

  actions: {

    saveResource ({ commit, state }) { // (vm) {
      console.log('designer: saving resource', state.metadata)
      const data = { resource: state.resource }
      if (state.metadata)
        data.resource.metadata = JSON.stringify(state.metadata)
      return axios.patch(state.resource_path, data)
        .then(response => {
          Object.keys(state.validationErrors).forEach(key => { Vue.delete(state.validationErrors, key) })
          state.unsaved = false
        })
        .catch(error => {
    			if (error.response &&
    		    error.response.data.error) {

            // Handle server side validation errors
            const apiError = error.response.data.error
            const validationErrors = apiError.validation_errors
            if (validationErrors) {
              console.log('saving: validation errors', validationErrors)
              Object.keys(state.validationErrors).forEach(key => { Vue.delete(state.validationErrors, key) })
              Object.keys(validationErrors).forEach(key => { Vue.set(state.validationErrors, key, validationErrors[key]) })
            }

    		    // console.log('saving: api error', error.response.data.error.detail)
    		    // vm.$toast.error(error.response.data.error.detail)
    			}
        })
    },
  },

  // Getters
  // --------------------------------------------------

  getters: {
    
    getPageSpec: (state) => (name) => {
      if (!state.spec.pages[name])
        throw Error('No page spec for: ' + name)
      return state.spec.pages[name]
    },

    getLayoutSpec: (state) => (name) => {
      if (!state.spec.layouts[name])
        throw Error('No layout spec for: ' + name)
      return state.spec.layouts[name]
    },

    getTemplateSpec: (state) => (name) => {
      if (!state.spec.templates[name])
        throw Error('No templates spec for: ' + name)
      return state.spec.templates[name]
    },

    getElementSpec: (state) => (name) => {
      if (!state.spec.elements[name])
        throw Error('No element spec for: ' + name)
      return state.spec.elements[name]
    },

    elementsSortedByCategory: (state) => {
      return sortItemsBy(state.spec.elements, 'category')
    },

    // Get the default or custom resource URL parameters for making API requests.
    resourceUrlParameters: (state) => (params) => {
      return Object.assign({
        resource_id: state.resourceId,
        resource_name: state.resourceName
      }, state.resourceUrlParameters, params)
    },

    // This method privides the ability to override the dynamic input component
    loadInputComponent: (state) => (spec) => {
    },

    // createDefaultPageData () {
    //   const name = state.spec.pages.find(x => x.creatable)
    //   return this.createPageData(name)
    // },
    //
    // createPageData (name) {
    //   const spec = this.getPageSpec(name)
    //   // console.log('createDefaultPageData spec', spec)
    //   const data = {
    //     id: name + '-' + randomString(10),
    //     name: name,
    //     data: spec.data || {},
    //     elements: spec.elements || []
    //   }
    //
    //   // Ensure default elements have IDs and a `data` object so they are
    //   // fully reactive
    //   data.elements.forEach(item => {
    //     if (!object.id)
    //       object.id = object.name + '-' + randomString(10)
    //     // this.modelId(item)
    //     if (!object.data)
    //       object.data = {}
    //   })
    //
    //   // Execute create actions
    //   Hooks.executeCreate (spec, data.data)
    //   return data
    // },
    //
    // createDefaultPage() {
    //   // NOTE: We only support a single creatable page type per spec
    //   const page = this.createDefaultPageData()
    //   console.log('createDefaultPage', page)
    //   state.metadata.push(page)
    //   state.unsaved = true
    //   IpcServer.postPreviewMessage('createPage', page)
    //   return page
    // },
    //
    // removePage(page) {
    //   const index = state.metadata.findIndex(x => x.id === page.id)
    //   state.metadata.splice(index, 1)
    //   state.unsaved = true
    //   IpcServer.postPreviewMessage('removePage', { id: page.id })
    // },
    //
    // // Create a page level element
    // createPageElement (page, elementName, sectionName, defaultData) {
    //   const element = this.createElementData(elementName, sectionName, defaultData)
    //   console.log('createPageElement', elementName, sectionName, element)
    //   page.elements.push(element)
    //   // this.addLayoutElement(element)
    //   IpcServer.postPreviewMessage('createElement', {
    //     id: page.id,
    //     element: element
    //   })
    //   return element
    // },
    //
    // // Remove a page level element
    // removePageElement (page, element) {
    //   page.elements.splice(
    //     page.elements.findIndex(x => x.id === element.id), 1)
    //   // this.sectionElements[element.section].splice(
    //   //   this.sectionElements[element.section].findIndex(x => x.id === element.id), 1)
    //   // Hooks.executeDeleteElement(this.designerBackendStore.getElementSpec(element.name), element)
    //   IpcServer.postPreviewMessage('removeElement', {
    //     id: page.id,
    //     elementId: element.id
    //   })
    // },
  }
}

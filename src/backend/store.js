import Vue from 'vue'
import IpcServer from './ipc-server'
import { randomString, mergeSpecDefaults, clone } from '../base/utils'
import buildURL from 'axios/lib/helpers/buildURL'
import axios from 'axios'

export default {
  state: {
    // Data
    spec: {},
    resource: {},
    // content: [],
    attachments: [],
    validationErrors: {},
    // attachmentMetadata: {},

    // Options
    // enable_pages: false,
    enableSections: false,
    enableGallery: false,
    enableElementEmbeds: false,
    enableRefresh: false,
    googleFontsApiKey: null,
    resourceUrlParameters: null,

    // API endpoints
    resourceUrl: null,
    attachmentUrl: null,
    attachmentUploadUrl: null,
    attachmentUploadUrl: null,
    attachmentDeleteUrl: null,
    attachmentThumbnailUrl: null,
    attachmentPreviewAssetUrl: null,
    attachmentCdnUrl: null,

    previewApp: null,
    previewExpanded: false,
    backendInterface: null
  },

  // Mutations
  // --------------------------------------------------

  mutations: {

    setPreviewApp (state, instance) {
      Vue.set(state, 'previewApp', instance)
    },

    setPreviewExpanded (state, flag) {
      Vue.set(state, 'previewExpanded', flag)
    },

    setDesignerResource (state, instance) {
      // console.log('$$$$$$$$$$$$$$$$$$$$$ setDesignerResource', instance)
      Vue.set(state, 'resource', instance)
    },

    setDesignerAttachemnts (state, attachments) {
      Vue.set(state, 'attachments', attachments)
    },

  },


  // Actions
  // --------------------------------------------------

  actions: {

    saveResource ({ commit, state }) { // (vm) {
      const data = { resource: clone(state.resource) }
      if (data.resource.content)
        data.resource.content = JSON.stringify(data.resource.content)

      console.log('designer: saving resource', data, state.resourceUrl)
      return axios.patch(state.resourceUrl, data)
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

    loadAttachments ({ commit, state, getters }) {
      axios.get(getters.buildResourceUrl(state.attachmentsUrl))
          .then(response => commit('setDesignerAttachemnts', response.data))

      // attachments
      // this.designerBackendState.attachmentsUrl
    }
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

    // Get the default or custom resource URL parameters for making API requests.
    buildResourceUrl: (state, getters) => (url, params) => {
      return buildURL(url, getters.resourceUrlParameters(params))
    },

    // Get the default or custom resource URL parameters for making API requests.
    resourceUrlParameters: (state) => (params) => {
      return Object.assign({
        resource_id: state.resourceId,
        resource_name: state.resourceName
      }, state.resourceUrlParameters, params)
    },

    // This method privides the ability to override the dynamic input component
    // loadInputComponent: (state) => (spec) => {
    // },

    designerPreviewApp: (state) => {
      return state.previewApp
    },

    designerPreviewExpanded: (state) => {
      return state.previewExpanded
    },

    designerBackendInterface: (state) => {
      return state.backendInterface
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
    //   state.content.push(page)
    //   state.unsaved = true
    //   IpcServer.postPreviewMessage('createPage', page)
    //   return page
    // },
    //
    // removePage(page) {
    //   const index = state.content.findIndex(x => x.id === page.id)
    //   state.content.splice(index, 1)
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
    //   // Hooks.executeDeleteElement(this.designerBackendStore.getters.getElementSpec(element.name), element)
    //   IpcServer.postPreviewMessage('removeElement', {
    //     id: page.id,
    //     elementId: element.id
    //   })
    // },
  }
}

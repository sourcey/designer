import Vue from 'vue'
import IpcServer from './ipc-server'
import Hooks from  './hooks'
import { randomString, mergeSpecDefaults, sortItemsBy } from './utils'
import axios from 'axios'
import buildURL from 'axios/lib/helpers/buildURL'

export const store = {
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
    attachmentUploadPathTemplate: null,
    attachmentDeletePathTemplate: null,
    attachmentThumbnailPathTemplate: null,
    attachmentCdnUrlTemplate: null,
  },


  // Spec
  // --------------------------------------------------

  // hasPages () {
  //   return !!this.state.spec.pages //this.state.metadata.find(item => !!item.page)
  // },
  //
  // hasCreatablePages () {
  //   return !!Object.values(this.state.spec.pages).find(x => x.creatable)
  // },

  getElementSpec (name) {
    if (!this.state.spec.elements[name])
      throw Error('No element spec for: ' + name)
    return this.state.spec.elements[name]
  },


  // Metadata
  // --------------------------------------------------

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
    Hooks.executeCreate (spec, element)
    return element
  },

  // Create a root level element
  createElement (name, section) {
    const element = this.createElementData(name, section)
    console.log('createElement', name, section, element)
    this.state.metadata.push(element)
    this.state.unsaved = true
    IpcServer.postPreviewMessage('createElement', element)
    return element
  },

  elementsSortedByCategory () {
    return sortItemsBy(this.state.spec.elements, 'category')
  },

  verifyMetadata() {
    if (!Array.isArray(this.state.metadata))
      return []
    return this.state.metadata.map(item => {
      if (!item.id)
        item.id = item.name + '-' + randomString(10)

      // Ensure element templates exist
      if (item.name) {
        const found = this.getElementSpec(item.name)
        // const found = Object.values(vm.spec).find(function(definition) {
        //   return definition.template == item.template
        // })
        if (found) {
          return item
        } else {
          alert('No template exists for: ' + JSON.stringify(item))
          return null
        }
      } else {
        return item
      }
    }).filter(Boolean)
  },

  // createDefaultPageData () {
  //   const name = this.state.spec.pages.find(x => x.creatable)
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
  //     if (!item.id)
  //       item.id = item.name + '-' + randomString(10)
  //     // this.itemId(item)
  //     if (!item.data)
  //       item.data = {}
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
  //   this.state.metadata.push(page)
  //   this.state.unsaved = true
  //   IpcServer.postPreviewMessage('createPage', page)
  //   return page
  // },
  //
  // removePage(page) {
  //   const index = this.state.metadata.findIndex(x => x.id === page.id)
  //   this.state.metadata.splice(index, 1)
  //   this.state.unsaved = true
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
  //   // Hooks.executeDeleteElement(this.designerStore.getElementSpec(element.name), element)
  //   IpcServer.postPreviewMessage('removeElement', {
  //     id: page.id,
  //     elementId: element.id
  //   })
  // },


  // Resource
  // --------------------------------------------------

  saveResource (vm) {
    console.log('designer: saving resource', this.state.metadata)
    const data = { resource: this.state.resource }
    if (this.state.metadata)
      data.resource.metadata = JSON.stringify(this.state.metadata)
    axios.patch(this.state.resource_path, data)
      .then(response => {
        Object.keys(this.state.validationErrors).forEach(key => { Vue.delete(this.state.validationErrors, key) })
        this.state.unsaved = false
      })
      .catch(error => {
  			if (error.response &&
  		    error.response.data.error) {

          // Handle server side validation errors
          const apiError = error.response.data.error
          const validationErrors = apiError.validation_errors
          if (validationErrors) {
            console.log('saving: validation errors', validationErrors)
            Object.keys(this.state.validationErrors).forEach(key => { Vue.delete(this.state.validationErrors, key) })
            Object.keys(validationErrors).forEach(key => { Vue.set(this.state.validationErrors, key, validationErrors[key]) })
          }

  		    // console.log('saving: api error', error.response.data.error.detail)
  		    // vm.$toast.error(error.response.data.error.detail)
  			}
      })
  },

  // Get the default or custom resource URL parameters for making API requests.
  resourceUrlParameters () {
    return store.state.resourceUrlParameters || {
      resource_id: store.state.resourceId,
      resource_name: store.state.resourceName
    }
  },


  // Inputs
  // --------------------------------------------------

  // This method privides the ability to override the dynamic input component
  loadInputComponent (spec) {
  },


  // Attachments
  // --------------------------------------------------

  attachmentDirectUploadUrl () {
    return buildURL(store.state.attachmentDirectUploadUrl, this.resourceUrlParameters())
  },

  attachmentUploadUrl (attachment) {
    return buildURL(store.state.attachmentUploadPathTemplate, this.resourceUrlParameters())
              .replace(':name', attachment.name ? attachment.name : 'attachments')
              .replace('%3Aname', attachment.name ? attachment.name : 'attachments')
  },

  attachmentDeleteUrl (attachment) {
    return buildURL(store.state.attachmentDeletePathTemplate, this.resourceUrlParameters())
              .replace(':key', encodeURIComponent(attachment.key))
              .replace("%3Akey", encodeURIComponent(attachment.key))
  },

  attachmentCdnUrl (attachment) {
    return buildURL(store.state.attachmentCdnUrlTemplate, this.resourceUrlParameters())
              .replace(':signed_id', encodeURIComponent(attachment.signed_id))
              .replace('%3Asigned_id', encodeURIComponent(attachment.signed_id))
              .replace(':filename', encodeURIComponent(attachment.filename))
              .replace('%3Afilename', encodeURIComponent(attachment.filename))
  },

  attachmentThumbnailUrl (attachment) {
    return buildURL(store.state.attachmentThumbnailPathTemplate, this.resourceUrlParameters())
              .replace(':key', encodeURIComponent(attachment.key))
              .replace('%3Akey', encodeURIComponent(attachment.key))
  }
}

import Vue from 'vue'
// import { DirectUpload } from '@rails/activestorage'
import { pick } from '../../base/utils'
// import { store } from './store'
import axios from 'axios'
// import buildURL from 'axios/lib/helpers/buildURL'


export default {
  methods: {
    createThumbnail (attachment) {

      // Create a thumbnail
      var fReader = new FileReader()
      fReader.readAsDataURL(attachment.file)
      fReader.onload = (event) => {
        console.log('attachment thumbnail created')
        Vue.set(attachment, 'thumbnail', event.target.result)
      }
    },
    uploadAttachment (attachment) {
      return new Promise((resolve, reject) => {

        // TODO: Use a presigned non-direct upload
        const { DirectUpload } = require('@rails/activestorage')
        console.log('uploading attachment', attachment, this.attachmentDirectUploadUrl())
        const directUpload = new DirectUpload(attachment.file, this.attachmentDirectUploadUrl(), this)
        directUpload.create((error, attributes) => {
          if (error) {
            console.log('attachment upload failed', error)
            // Vue.set(attachment, 'error', `Upload failed: ${error}`)
            const message = `Upload failed: ${error}`
            Vue.set(attachment, 'error', message)
            reject(message)
          } else {

            // Associate the attachment with the resource
            axios.post(this.attachmentUploadUrl(attachment), {
                file: attributes.signed_id,
                metadata: attachment.metadata
              })
              .then(response => {
                console.log('attachment upload association success', attributes)
                Vue.set(attachment, 'key', attributes.key)
                Vue.set(attachment, 'signed_id', attributes.signed_id)
                Vue.set(attachment, 'filename', attributes.filename)
                Vue.set(attachment, 'size', attributes.size)
                Vue.set(attachment, 'content_type', attributes.content_type)
                resolve(attachment)
              })
              .catch(error => {
                console.log('attachment upload association failed', status, error)
                const message = 'Upload failed' // `Upload failed: ${error}`
                Vue.set(attachment, 'error', message)
                reject(message)
              })
          }
        })
      })
    },

    destroyAttachment (attachment) {
      console.log('destroy attachment', attachment)
      return axios.delete(this.attachmentDeleteUrl(attachment))
    },

    loadAttachments () {
      console.log('load attachments', this.attachmentsUrl())
      return axios.get(this.attachmentsUrl())
    },

    attachmentVisible (attachment) {
       return attachment && (
         attachment.key ||
         attachment.asset ||
         attachment.thumbnail ||
         attachment.url ||
         attachment.error)
    },

    serializeAttachment (attachment) {
      return pick(attachment, ['key', 'signed_id', 'filename', 'byte_size', 'content_type', 'url', 'asset'])
    },


    // Authorization
    // --------------------------------------------------

    accessToken () {

      // Return the auth token if the `$api` object is defined
      if (this.$api)
        return this.$api.token
    },

    directUploadWillCreateBlobWithXHR (xhr) {
      if (this.accessToken())
        xhr.setRequestHeader('Authorization', this.accessToken())
    },


    // URLs
    // --------------------------------------------------

    buildAttachmentUrl (endpointName, ...rest) {
      // NOTE: If no designer backend store is available then the instance must
      // define the `$api.routes` object.
      if (this.$api && this.$api.routes && typeof this.$api.routes[endpointName] === 'function') {
        const args = [...rest, this.url_params].filter(_ => _)
        return this.$api.routes[endpointName].apply(null, args)
        // (...rest, this.url_params)
      }
      else if (this.designerBackendStore) {
        const baseUrl = this.designerBackendState[endpointName]
        return this.designerBackendStore.getters.buildResourceUrl(baseUrl, this.url_params)
      }
      else {
        alert('Attachment endpoint not defined: ' + endpointName)
      }
    },

    attachmentDirectUploadUrl (params) {
      return this.buildAttachmentUrl('attachmentDirectUploadUrl')
    },

    attachmentUploadUrl (attachment) {
      return this.buildAttachmentUrl('attachmentUploadUrl', attachment.name)
                .replace(':name', attachment.name ? attachment.name : 'attachments')
                .replace('%3Aname', attachment.name ? attachment.name : 'attachments')
    },

    attachmentDeleteUrl (attachment) {
      return this.buildAttachmentUrl('attachmentDeleteUrl',
          encodeURIComponent(attachment.key))
                .replace(':key', encodeURIComponent(attachment.key))
                .replace("%3Akey", encodeURIComponent(attachment.key))
    },

    attachmentCdnUrl (attachment) {
      return this.buildAttachmentUrl('attachmentCdnUrl',
          encodeURIComponent(attachment.signed_id),
          encodeURIComponent(attachment.filename))
                .replace(':signed_id', encodeURIComponent(attachment.signed_id))
                .replace('%3Asigned_id', encodeURIComponent(attachment.signed_id))
                .replace(':filename', encodeURIComponent(attachment.filename))
                .replace('%3Afilename', encodeURIComponent(attachment.filename))
    },

    attachmentThumbnailUrl (attachment) {
      if (attachment.key) {

        // If our `attachmentUrl` is defined on the instance then always use that
        if (typeof this.attachmentUrl === 'function') {
          return this.attachmentUrl(attachment, 'thumb')
        }

        return this.buildAttachmentUrl('attachmentThumbnailUrl')
                  .replace(':key', encodeURIComponent(attachment.key))
                  // .replace('%3Akey', encodeURIComponent(attachment.key))
      }
      // else if (attachment.asset) {
      //
      //   // This path is used for static preview assets displayed from the local filesystem
      //   return this.buildAttachmentUrl(previewUrl + this.designerBackendState.attachmentPreviewAssetUrl)
      //             .replace(':asset', attachment.asset)
      //
      // }
    },

    attachmentsUrl () {
      return this.buildAttachmentUrl('attachmentsUrl')
    }
  }
}

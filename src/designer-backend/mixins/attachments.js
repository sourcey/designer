import Vue from 'vue'
// import { DirectUpload } from '@rails/activestorage'
import { pick } from '../../designer/utils'
// import { store } from './store'
import axios from 'axios'
// import buildURL from 'axios/lib/helpers/buildURL'


export default {
  methods: {
    uploadAttachment (attachment) {
      return new Promise((resolve, reject) => {

        // Create a thumbnail
        var fReader = new FileReader()
        fReader.readAsDataURL(attachment.file)
        fReader.onload = (event) => {
          console.log('attachment thumbnail created')
          Vue.set(attachment, 'thumbnail', event.target.result)
        }

        // TODO: Use a presigned non-direct upload
        const { DirectUpload } = require('@rails/activestorage')
        // import { DirectUpload } from '@rails/activestorage'
        // import { DirectUpload } from '@rails/activestorage'
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


    // URLs
    // --------------------------------------------------

    buildAttachmentUrl (baseUrl) {
      return this.designerBackendStore.getters.buildResourceUrl(baseUrl,
          this.spec && this.spec.url_params ? this.spec.url_params : null)
      // return buildURL(baseUrl, this.designerBackendStore.getters.resourceUrlParameters(
      //   this.spec && this.spec.url_params ? this.spec.url_params : null))
    },

    attachmentDirectUploadUrl (params) {
      return this.buildAttachmentUrl(this.designerBackendState.attachmentDirectUploadUrl)
    },

    attachmentUploadUrl (attachment) {
      return this.buildAttachmentUrl(this.designerBackendState.attachmentUploadUrlTemplate)
                .replace(':name', attachment.name ? attachment.name : 'attachments')
                .replace('%3Aname', attachment.name ? attachment.name : 'attachments')
    },

    attachmentDeleteUrl (attachment) {
      return this.buildAttachmentUrl(this.designerBackendState.attachmentDeleteUrlTemplate)
                .replace(':key', encodeURIComponent(attachment.key))
                .replace("%3Akey", encodeURIComponent(attachment.key))
    },

    attachmentCdnUrl (attachment) {
      return this.buildAttachmentUrl(this.designerBackendState.attachmentCdnUrlTemplate)
                .replace(':signed_id', encodeURIComponent(attachment.signed_id))
                .replace('%3Asigned_id', encodeURIComponent(attachment.signed_id))
                .replace(':filename', encodeURIComponent(attachment.filename))
                .replace('%3Afilename', encodeURIComponent(attachment.filename))
    },

    attachmentThumbnailUrl (attachment) {
      if (attachment.key) {

        // If our `attachmentUrl` is defined on the instance then always use that
        if (typeof this.attachmentUrl  === 'function') {
          return this.attachmentUrl(attachment, 'thumb')
        }

        return this.buildAttachmentUrl(this.designerBackendState.attachmentThumbnailUrlTemplate)
                  .replace(':key', encodeURIComponent(attachment.key))
                  // .replace('%3Akey', encodeURIComponent(attachment.key))
      } else if (attachment.asset) {

        // This path is used for static preview assets displayed from the local filesystem
        return this.buildAttachmentUrl(this.designerBackendState.previewUrl + this.designerBackendState.attachmentPreviewAssetUrlTemplate)
                  .replace(':asset', attachment.asset)

      }
    },

    attachmentsUrl () {
      return this.buildAttachmentUrl(this.designerBackendState.attachmentsUrl)
    }
  }
}

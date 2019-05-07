import Vue from 'vue'
import { DirectUpload } from '@rails/activestorage'
import { pick } from './utils'
import { store } from './store'
import axios from 'axios'


export default {
  upload (attachment) {
    console.log('uploading attachment', attachment)
    return new Promise((resolve, reject) => {

      // Create a thumbnail
      var fReader = new FileReader()
      fReader.readAsDataURL(attachment.file)
      fReader.onload = (event) => {
        console.log('attachment thumbnail created')
        Vue.set(attachment, 'thumbnail', event.target.result)
      }

      // TODO: Use a presigned non-direct upload
      const directUpload = new DirectUpload(attachment.file, store.attachmentDirectUploadUrl(), this)
      directUpload.create((error, attributes) => {
        if (error) {
          console.log('attachment upload failed', error)
          // Vue.set(attachment, 'error', `Upload failed: ${error}`)
          const message = `Upload failed: ${error}`
          Vue.set(attachment, 'error', message)
          reject(message)
        } else {

          // Associate the attachment with the resource
          axios.post(store.attachmentUploadUrl(attachment), {
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

  destroy (attachment) {
    console.log('destroy attachment', attachment)
    axios.delete(store.attachmentDeleteUrl(attachment))
  },

  serialize (attachment) {
    return pick(attachment, ['key', 'signed_id', 'filename', 'byte_size', 'content_type', 'url'])
  },
}

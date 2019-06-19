<template lang="pug">
.item-wrap.designer-attachment-input.attachment-single-input
  .form-group
    label.form-label.d-block(v-if='spec.label !== false' :for='inputId') {{ inputLabel }}
    .preview-item(v-if='attachment')
      .overlay.center-container.h-100
        .error.text-danger(v-if='attachment.error' v-b-tooltip :title='attachment.error')
          i.fas.fa-exclamation-triangle
        .loader.spinner-border(v-else-if='!attachment.key' role='status')
          span.sr-only Loading...
      a.delete(href='#' @click.prevent='removeAttachment(attachment)')
      //- i.fas.fa-times
      //- span {{ attachment }}
      img.img-fluid(v-if='attachment.thumbnail' :src='attachment.thumbnail')
      img.img-fluid(v-else-if='attachment.key' :src='designerStore.attachmentThumbnailUrl(attachment)')
      img.img-fluid(v-else-if='attachment.url' :src='attachment.url')
    div(v-else)
      label.btn-upload.dropzone.p-15(:for='inputId')
        designer-icon.mb-025(name='upload-cloud' size='32')
        .btn-text Upload
      input(:id='inputId' type='file' multiple='' accept='image/*' @change='filesChange')
</template>

<script>
import Input from '../../mixins/input'
import Attachments from '../../attachments'
import { randomString } from '../../utils'


export default {
  extends: Input,
  data() {
    return {
      // object: this.item,
      attachment: null // this.item && typeof(this.item[this.name]) === 'object' ? this.item[this.name] : null
    }
  },
  mounted () {
    this.attachment = this.value
  },
  methods: {
    filesChange(event) {
      console.log('files added', event.target.files)

      Array.from(event.target.files).forEach(file => {
        const attachment = this.attachment = {
          file: file,
          metadata: this.fileMetadata()
        }

        console.log('uploading attachment', this.parent, this.item, attachment)

        // Sanity check
        if (this.root && this.parent && // && this.root.elements
          !attachment.metadata.designer_element_id) {
          alert('Could not associate attachment with element')
          return
        }
        Attachments.upload(attachment)
          .then(() => {
            this.value = Attachments.serialize(attachment)
            this.emitUpdate()

            // HACK: Save when an image is uploaded or it may be lost in space
            //this.designerStore.save(this)
          })
      })
    },
    // fileMetadata () {
    //   const meta = {}
    //   if (this.root && this.root.elements && this.parent) { // TODO: better way of detecting page
    //     meta.designer_page_id = this.root.id
    //     meta.designer_element_id = this.parent.id
    //   }
    //   return meta
    // },
    removeAttachment (attachment) {
      if (confirm("Are you sure?")) {
        if (attachment.key)
          Attachments.destroy(attachment)
        this.value = null
        this.attachment = null
        this.emitUpdate()

        // HACK: Save when a new image is uploaded or it may be lost in space
        //this.designerStore.save(this)
      }
    }
  }
}
</script>

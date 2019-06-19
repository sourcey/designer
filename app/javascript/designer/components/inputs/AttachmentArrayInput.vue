<template lang="pug">
.item-wrap.designer-attachment-input.attachment-array-input
  .form-group
    label.form-label.d-block(v-if='spec.label !== false' :for='inputId') {{ inputLabel }}
    small.text-muted.font-italic(v-if='validateMax') Maximum {{ spec.max }} images
    div(v-else)
      label.btn-upload.dropzone.p-1(:for='inputId')
        designer-icon.mb-025(name='upload-cloud' size='32')
        .btn-text Upload
      input(:id='inputId' type='file' multiple='' accept='image/*' @change='filesChange')
  .form-row(v-if='attachments.length')
    .col-4.col-lg-3(v-for='(attachment, index) in attachments')
      .preview-item.mt-05
        .overlay.center-container.h-100
          .error.text-danger(v-if='attachment.error' v-b-tooltip :title='attachment.error')
            i.fas.fa-exclamation-triangle
          .loader.spinner-border(v-else-if='!attachment.key' role='status')
            span.sr-only Loading...
        a.delete(href='#' @click.prevent='removeAttachment(attachment)')
        img.img-fluid(v-if='attachment.thumbnail' :src='attachment.thumbnail')
        img.img-fluid(v-else-if='attachment.key' :src='designerStore.attachmentThumbnailUrl(attachment)')
        img.img-fluid(v-else-if='attachment.url' :src='attachment.url')
</template>

<script>
import Input from '../../mixins/input'
import Attachments from '../../attachments'
import { randomString } from '../../utils'


export default {
  extends: Input,
  // mixins: [Attachments],
  data() {
    return {
      // inputId: this.item.id || randomString(5),
      // object: this.item, // || {}
      attachments: [], //this.item[this.name],
    }
  },
  mounted () {
    if (!Array.isArray(this.value)) {
      this.value = []
    }
    // else {
    //   this.value = this.value.filter(attachment => attachment.key)
    // }
    this.value.forEach(attachment => this.attachments.push(attachment))
  },
  computed: {
    validateMax () {
      if (this.spec.max &&
        this.attachments.length >= this.spec.max)
        return true
      return false
    },
  },
  methods: {
    filesChange(event) {
      console.log('files added', event.target.files)

      Array.from(event.target.files).forEach(file => {
        if (this.validateMax) {
          alert(`You've reached the maximum of ${this.spec.max} images for this element.`)
          return
        }

        let attachment = {
          file: file,
          metadata: this.fileMetadata()
        }

        // Sanity check
        if (!attachment.metadata.designer_element_id) {
          alert('Could not associate attachment with element')
          return
        }

        // Add the object to the proxy `attachments` array.
        // It wont be added to the main object until the upload has succeeded.
        this.attachments.push(attachment)
        Attachments.upload(attachment)
          .then(() => {
            // HACK: Calling `push` is not triggering reactivity across frame borders,
            // so the instance must be reassigned.
            // this.value.push(Attachments.serialize(attachment))

            this.emitUpdate()
            // HACK: Save when an image is uploaded or it may be lost in space
            //this.designerStore.save(this)
          })
      })
    },
    emitUpdate () {
      // HACK: Calling `push` or `splice` on the array is not triggering reactivity
      // across frame borders, but reassigning the instance does the trick.
      this.value = this.attachments.map(attachment => Attachments.serialize(attachment))
      this.emitUpdate()
    },
    removeAttachment (attachment) {
      if (confirm("Are you sure?")) {

        // Delete from server
        if (attachment.key)
          Attachments.destroy(attachment)

        // Remove from object data
        // const ia = this.value.findIndex(x => Object.is(x, attachment))
        // if (ia !== -1) this.value.splice(ia, 1)
        // for (let i = 0; i < this.value.length; i++) {
        //   // if (this.value[i].key === attachment.key) {
        //   if (Object.is(this.value[i], attachment)) {
        //     this.value.splice(i, 1)
        //     break
        //   }
        // }

        // Remove from attachments
        this.attachments.splice(this.attachments.findIndex(x => Object.is(x, attachment)), 1)
        // const ib = this.attachments.findIndex(x => Object.is(x, attachment))
        // if (ib !== -1)
        // for (let i = 0; i < this.attachments.length; i++) {
        //   // if (this.attachments[i].key === attachment.key) {
        //   if (Object.is(this.attachments[i], attachment)) {
        //     this.attachments.splice(i, 1)
        //     break
        //   }
        // }

        this.emitUpdate()
        // this.emitUpdate()

        // HACK: Save when a image is deleted or it may be lost in space
        // this.designerStore.save(this)
      }
    }
  }
}
</script>

<template lang="pug">
.item-wrap.attachment-input.attachment-single-input
  //-
    <br>name: >>>
    <br>spec: >>>
    <br>{{spec}}
    <br>spec type: >>>
    <br>{{spec.type}}
    <br>object: >>>
    <br>{{object}}
  .form-group
    label.form-label.d-block(v-if='spec.label !== false' :for="'input-' + name") {{ inputLabel }}
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
    //- button.btn.btn-sm.btn-outline-success.btn-upload(v-else)
      designer-icon(name='plus')
      span Upload
      input.input-file(type='file' :accept="spec.accept || 'image/*'", :name='name' @change='filesChange')
</template>

<script>
import Input from '../../mixins/input'
import Attachments from '../../attachments'
import { randomString } from '../../utils'

export default {
  extends: Input,
// export default {
//   props: ['spec', 'name', 'item', 'parent', 'root'],
  data() {
    return {
      // inputId: this.item.id || randomString(5),
      attachment: this.value // this.item && typeof(this.value) === 'object' ? this.value : null
    }
  },
  mounted () {
  },
  methods: {
    filesChange(event) {
      console.log('files added', event.target.files)

      Array.from(event.target.files).forEach(file => {
        const attachment = this.attachment = {
          file: file,
          name: this.name
        }

        Attachments.upload(attachment)
          .then(() => {
            this.value = Attachments.serialize(attachment)
            this.emitUpdate()
            // this.$emit('update', this.name, this.value)

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
        this.$emit('update', this.name, null)

        // HACK: Save when a new image is uploaded or it may be lost in space
        //this.designerStore.save(this)
      }
    }
  }
}
</script>

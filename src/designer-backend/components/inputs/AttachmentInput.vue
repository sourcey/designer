<template lang="pug">
.item-wrap.designer-attachment-input.attachment-single-input
  .form-group
    label.control-label.d-block(v-if='spec.label !== false' :for='inputId') {{ inputLabel }}
    .preview-item(v-if='attachmentVisible(attachment)' :class="{'is-invalid': attachment.error}")
      .preview-overlay.flex-center
        .error.text-danger(v-if='attachment.error' v-b-tooltip :title='attachment.error')
          i.fas.fa-exclamation-triangle
        spinner(v-else-if='!attachment.key')
      a.delete(href='#' @click.prevent='removeAttachment(attachment)')
      img.img-fluid(v-if='attachment.thumbnail' :src='attachment.thumbnail')
      img.img-fluid(v-else-if='attachment.key || attachment.asset' :src='attachmentThumbnailUrl(attachment)' @error='setError')
      img.img-fluid(v-else-if='attachment.url' :src='attachment.url')
    div(v-else)
      label.btn-upload.dropzone.flex-center.p-15(:for='inputId')
        .icon-wrap
          designer-icon.mb-025(:name='spec.icon || "upload-cloud"' size='32')
          .btn-text Upload
      input(:id='inputId' type='file' multiple='' accept='image/*' @change='filesChange')
</template>

<script>
import Input from '../../mixins/input'
import Attachments from '../../mixins/attachments'
import Spinner from '../../../designer/components/Spinner'
import { randomString, copyValue } from '../../../designer/utils'
// import { randomString, copyValue, titleize } from '../../designer/utils'


export default {
  extends: Input,
  mixins: [ Attachments ],
  components: {
    Spinner
  },
  data () {
    return {
      // object: this.model,
      attachment: null // this.model && typeof(this.model[this.name]) === 'object' ? this.model[this.name] : null
    }
  },
  created () {
    this.attachment = copyValue(this.value)

    // NOTE: It's necessary to initialize the object or `this.value` computed
    // getter doesnt update after setting value in upload callback. Just
    // initializing to NULL is not sufficient. This issue was noticed when
    // changing section layout on Artzine.
    // if (!this.value)
      this.value = {}
  },
  methods: {
    filesChange(event) {
      console.log('files added', event.target.files)

      Array.from(event.target.files).forEach(file => {
        const attachment = this.attachment = { //this.value =
          file: file,
          metadata: this.fileMetadata ()
        }

        console.log('uploading attachment', this.parent, this.model, attachment, this.spec.url_names)

        // Sanity check (for designer elements)
        if (this.root && this.parent && // && this.root.elements
          !attachment.metadata.designer_element_id) {
          alert('Could not associate attachment with element')
          return
        }

        this.uploadAttachment(attachment)
          .then(() => {
            this.value = this.serializeAttachment(attachment)
            // this.recomputeValue = true

            // this.$nextTick(() => {
            // // this.model[this.name] = this.serializeAttachment(attachment)
            // console.log('UPPPPPPPPPPP', this.value, this.model[this.name], attachment, this.serializeAttachment(attachment))
            this.emitUpdate()
            // })

            // HACK: Save when an image is uploaded or it may be lost in space
            //this.designerBackendStore.save(this)
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
    setError () {
      if (this.attachment)
        this.attachment.error = 'Invalid image'
      this.$forceUpdate()
    },
    removeAttachment (attachment) {
      if (confirm("Are you sure?")) {
        if (attachment.key)
          this.destroyAttachment(attachment)
        this.value = null
        this.attachment = null
        this.emitUpdate()

        // HACK: Save when a new image is uploaded or it may be lost in space
        //this.designerBackendStore.save(this)
      }
    }
  }
}
</script>

<template lang="pug">
.item-wrap.designer-attachment-input.attachment-single-input
  .form-group
    //- div {{ attachment }}
    //- div {{ currentValue }}
    label.control-label.d-block(v-if='label !== false' :for='inputId') {{ inputLabel }}
    //- div {{currentAttachmentName}}
    attachment-preview-item(v-if='attachmentVisible(currentAttachment)' :attachment='currentAttachment' @remove='removeAttachment')
    //- attachment-preview-item(v-if='tempAttachment' :attachment='tempAttachment || currentValue' @remove='')
    //- attachment-preview-item(v-else :attachment='currentValue')
    //- .preview-item(v-if='attachmentVisible(attachment)' :class="{'is-invalid': attachment.error}")
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
          icon.mb-025(:name='icon || "camera"' size='32')
          .btn-text Upload
      input(:id='inputId' type='file' multiple='' accept='image/*' @change='filesChange')
</template>

<script>
import Input from '../../mixins/input'
import Attachments from '../../mixins/attachments'
import AttachmentPreviewItem from './AttachmentPreviewItem'
import Spinner from '../../../base/components/Spinner'
import { randomString, copyValue } from '../../../base/utils'


export default {
  extends: Input,
  mixins: [ Attachments ],
  components: {
    AttachmentPreviewItem,
    Spinner
  },
  props: {
    icon: {
      type: String
    },
    url_params: {
      type: Object
    }
  },
  data () {
    return {
      // object: this.model,
      tempAttachment: null // this.model && typeof(this.model[this.name]) === 'object' ? this.model[this.name] : null
    }
  },
  // created () {
  //   console.log('ATTACHMENT!!!!!!!!!!!!!!!!', this.currentValue)
  //   // this.tempAttachment = copyValue(this.currentValue)
  //
  //   // NOTE: It's necessary to initialize the object or `this.value` computed
  //   // getter doesnt update after setting value in upload callback. Just
  //   // initializing to NULL is not sufficient. This issue was noticed when
  //   // changing section layout on Artzine.
  //   // if (!this.value)
  //   //   this.value = {}
  // },
  computed: {
    currentAttachment () {
      return this.tempAttachment || this.currentValue //copyValue(this.currentValue)
    },
    // currentAttachmentName () {
    //   return this.tempAttachment ? 'tempAttachment' : 'currentValue' //copyValue(this.currentValue)
    // }
  },
  methods: {
    filesChange (event) {
      console.log('files added', event.target.files)

      Array.from(event.target.files).forEach(file => {
        // const attachment =
        this.tempAttachment = { //this.value =
          file: file,
          metadata: this.fileMetadata()
        }

        console.log('uploading attachment', this.tempAttachment, this.url_params)

        // Sanity check (for designer elements)
        if (this.root && this.parent && // && this.root.elements
          !this.tempAttachment.metadata.designer_element_id) {
          alert('Could not associate attachment with element')
          return
        }

        this.createThumbnail(this.tempAttachment)
        this.uploadAttachment(this.tempAttachment)
          .then(() => {
            this.currentValue = this.serializeAttachment(this.tempAttachment)
            this.tempAttachment = null
            // this.recomputeValue = true

            // this.$nextTick(() => {
            // // this.model[this.name] = this.serializeAttachment(attachment)
            // console.log('UPPPPPPPPPPP', this.value, this.model[this.name], attachment, this.serializeAttachment(attachment))
            // this.emitUpdate()
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
      if (this.tempAttachment)
        this.tempAttachment.error = 'Invalid image'
      this.$forceUpdate()
    },
    removeAttachment (attachment) {
      if (confirm("Are you sure?")) {
        if (attachment.key)
          this.destroyAttachment(attachment)
        this.currentValue = null
        // this.tempAttachment = null
        // this.emitUpdate()

        // HACK: Save when a new image is uploaded or it may be lost in space
        //this.designerBackendStore.save(this)
      }
    }
  }
}
</script>

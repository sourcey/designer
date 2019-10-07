<template lang="pug">
.item-wrap.designer-attachment-input.attachment-array-input
  div(v-if='attachments.length')
    div(v-for='(attachment, index) in attachments')
      //- div {{attachmentThumbnailUrl(attachment)}}
      attachment-preview-item.mb-05(v-if='attachmentVisible(attachment)' :attachment='attachment' @remove='removeAttachment')
      //- .preview-overlay.flex-center
      //-   .error.text-danger(v-if='attachment.error' v-b-tooltip.hover :title='attachment.error')
      //-     i.fas.fa-exclamation-triangle
      //-   spinner(v-else-if='!attachment.key')
      //- a.delete(href='#' @click.prevent='removeAttachment(attachment)')
      //- img.img-fluid(v-if='attachment.thumbnail' :src='attachment.thumbnail')
      //- img.img-fluid(v-else-if='attachment.key || attachment.asset' :src='attachmentThumbnailUrl(attachment)')
      //- img.img-fluid(v-else-if='attachment.url' :src='attachment.url')
  .form-group
    label.control-label.d-block(v-if='label !== false' :for='inputId') {{ inputLabel }}
    small.text-muted.font-italic(v-if='validateMax') Maximum {{ max }} images
    div(v-else)
      label(:for='inputId')
        slot(name='button')
          .btn-upload.dropzone.flex-center.p-1
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
import { randomString } from '../../../base/utils'


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
    },
    max: {
      type: Number
    }
  },
  data () {
    return {
      // inputId: this.object.id || randomString(5),
      // object: this.model, // || {}
      attachments: [], //this.model[this.name],
    }
  },
  created () {
    if (!Array.isArray(this.currentValue)) {
      this.currentValue = []
    }
    this.currentValue.forEach(attachment => this.attachments.push(attachment))
  },
  computed: {
    validateMax () {
      if (this.max &&
        this.attachments.length >= this.max)
        return true
      return false
    },
  },
  methods: {
    filesChange(event) {
      console.log('files added', event.target.files)

      Array.from(event.target.files).forEach(file => {
        if (this.validateMax) {
          alert(`You've reached the maximum of ${this.max} images for this element.`)
          return
        }

        let attachment = {
          file: file,
          metadata: this.fileMetadata()
        }

        // Sanity check (for designer elements)
        if (this.root && this.parent && // && this.root.elements
          !attachment.metadata.designer_element_id) {
          alert('Could not associate attachment with element')
          return
        }

        // Add the object to the proxy `attachments` array.
        // It wont be added to the main object until the upload has succeeded.
        this.attachments.push(attachment)

        this.createThumbnail(attachment)
        this.uploadAttachment(attachment)
          .then(() => {
            // HACK: Calling `push` is not triggering reactivity across frame borders,
            // so the instance must be reassigned.
            // this.value.push(this.serializeAttachment(attachment))

            this.triggerUpdate()
            // HACK: Save when an image is uploaded or it may be lost in space
            //this.designerBackendStore.save(this)
          })
      })
    },
    triggerUpdate () {
      // HACK: Calling `push` or `splice` on the array is not triggering reactivity
      // across frame borders, but reassigning the instance does the trick.
      this.currentValue = this.attachments.map(attachment => this.serializeAttachment(attachment))
      // this.emitUpdate()
    },
    removeAttachment (attachment) {
      if (confirm("Are you sure?")) {

        // Delete from server
        if (attachment.key)
          this.destroyAttachment(attachment)

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

        this.triggerUpdate()
        // this.emitUpdate()

        // HACK: Save when a image is deleted or it may be lost in space
        // this.designerBackendStore.save(this)
      }
    }
  }
}
</script>

<template lang="pug">
.item-wrap.designer-attachment-input.attachment-array-input(:class="{'is-invalid': !!errorMessage, 'is-focus': focused, 'is-empty': !value}")
  .form-group
    label.control-label.d-block(v-if='label !== false' :for='inputId') {{ inputLabel }}
    small.text-muted.font-italic(v-if='validateMax') Maximum {{ max }} images
    .attachment-preview-wrap.d-flex.flex-fill
      attachment-preview-item(v-for='(attachment, index) in attachments' :key='index' v-if='attachmentVisible(attachment)' :attachment='attachment' @remove='removeAttachment')
      .btn-upload-wrap
        label(v-if='!validateMax' :for='inputId')
          slot(name='button')
            .btn-upload.dropzone.flex-center.p-1
              .icon-wrap
                icon.mb-025(:name='icon || "camera"' size='32')
                .btn-text Upload
        input(:id='inputId' type='file' multiple='' accept='image/*' @change='filesChange')
      //- .flex-fill.preview-images(v-if='attachments.length')
    .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
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
    filesChange (event) {
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
        this.uploadAttachment(attachment, this.url_params)
          .then(() => {
            // HACK: Calling `push` is not triggering reactivity across frame borders,
            // so the instance must be reassigned.
            // this.currentValue.push(this.serializeAttachment(attachment))

            this.triggerUpdate()
            // HACK: Save when an image is uploaded or it may be lost in space
            //this.designerBackendStore.save(this)

            // Try to remove the validation message if set
            this.clearErrorMessage()
          })
      })

      // Reset the file input
      event.target.value = ''
    },
    triggerUpdate () {
      // HACK: Calling `push` or `splice` on the array is not triggering reactivity
      // across frame borders, but reassigning the instance does the trick.
      this.currentValue = this.attachments.map(attachment => this.serializeAttachment(attachment))
    },
    removeAttachment (attachment) {
      if (confirm("Are you sure?")) {

        // Delete from server
        if (attachment.key)
          this.destroyAttachment(attachment, this.url_params)

        // Remove from object data
        // const ia = this.currentValue.findIndex(x => Object.is(x, attachment))
        // if (ia !== -1) this.currentValue.splice(ia, 1)
        // for (let i = 0; i < this.currentValue.length; i++) {
        //   // if (this.currentValue[i].key === attachment.key) {
        //   if (Object.is(this.currentValue[i], attachment)) {
        //     this.currentValue.splice(i, 1)
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

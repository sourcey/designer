<template lang="pug">
.item-wrap.attachment-input.attachment-array-input
  //-
    {{ object }}
    <br>name: >>>
    <br>spec: >>>
    <br>{{spec}}
    <br>spec type: >>>
    <br>{{spec.type}}
    <br>object: >>>
    <br>{{object}}
  .form-group
    label.form-label.d-block(v-if='spec.label !== false' :for="'input-' + name") {{ itemLabel(name, spec) }}
    //- label.text-btn.text-success.btn-upload
    small.text-muted.font-italic(v-if='validateMax') Maximum {{ spec.validate.max }} images
    button.btn.btn-sm.btn-outline-success.btn-upload(v-else)
      i.fas.fa-plus
      span Upload
      input.input-file(type='file' multiple='' :accept="spec.accept || 'image/*'" :name='name' @change='filesChange')
  .form-row(v-if='attachments.length')
    //- .preview-items.clearfix.mt-1
    .col-4.col-lg-3(v-for='(attachment, index) in attachments')
      .preview-item.mt-05
        .overlay.center-container.h-100
          .error.text-danger(v-if='attachment.error' v-b-tooltip :title='attachment.error')
            i.fas.fa-exclamation-triangle
          .loader.spinner-border(v-else-if='!attachment.key' role='status')
            span.sr-only Loading...
        a.delete(href='#' @click.prevent='removeAttachment(attachment)')
        //- i.fas.fa-times
        img.img-fluid(v-if='attachment.thumbnail' :src='attachment.thumbnail')
        img.img-fluid(v-else-if='attachment.key' :src='designerStore.attachmentThumbnailUrl(attachment)')
        img.img-fluid(v-else-if='attachment.url' :src='attachment.url')
</template>

<script>
import Attachments from '../../attachments'


export default {
  props: ['spec', 'name', 'item', 'parent', 'root'],
  // mixins: [Attachments],
  data() {
    return {
      object: this.item, // || {}
      attachments: [],
    }
  },
  mounted () {
    if (!Array.isArray(this.object[this.name])) {
      this.object[this.name] = []
    } else {
      this.object[this.name] = this.object[this.name].filter(attachment => attachment.key)
    }
    this.object[this.name].forEach(attachment => this.attachments.push(attachment))
  },
  computed: {
    validateMax () {
      if (this.spec.validate &&
        this.spec.validate.max &&
        this.attachments.length >= this.spec.validate.max)
        return true
      return false
    },
  },
  methods: {
    filesChange(event) {
      console.log('files added', event.target.files)

      Array.from(event.target.files).forEach(file => {
        if (this.validateMax) {
          alert(`You've reached the maximum of ${this.spec.validate.max} images for this element.`)
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
        this.attachments.push(attachment)
        Attachments.upload(attachment)
          .then(() => {
            this.object[this.name] = Attachments.serialize(attachment)
            this.$emit('update', this.name, this.object[this.name])

            // HACK: Save when an image is uploaded or it may be lost in space
            //this.designerStore.save(this)
          })
      })
    },
    // fileMetadata () {
    //   const meta = {}
    //   if (this.root.elements) // TODO: better way of detecting page
    //     meta.designer_page_id = this.root.id
    //   meta.designer_element_id = this.parent.id
    //   return meta
    // },
    removeAttachment (attachment) {
      if (confirm("Are you sure?")) {

        // Delete from server
        Attachments.destroy(attachment)

        // Remove from object data
        for (let i = 0; i < this.object[this.name].length; i++) {
          if (this.object[this.name][i].key === attachment.key) {
            this.object[this.name].splice(i, 1)
            break
          }
        }

        // Remove from attachments
        for (let i = 0; i < this.attachments.length; i++) {
          if (this.attachments[i].key === attachment.key) {
            this.attachments.splice(i, 1)
            break
          }
        }

        this.$emit('update', this.name, this.object[this.name])

        // HACK: Save when a image is deleted or it may be lost in space
        //this.designerStore.save(this)
      }
    }
  }
}
</script>

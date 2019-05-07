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
    label.form-label.d-block(v-if='spec.label !== false' :for="'input-' + name") {{ itemLabel(name, spec) }}
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
    button.btn.btn-sm.btn-outline-success.btn-upload(v-else)
      i.fas.fa-plus
      span Upload
      input.input-file(type='file' :accept="spec.accept || 'image/*'", :name='name' @change='filesChange')
  //- .preview-items.clearfix.mt-1
</template>

<script>
import Attachments from '../../attachments'


export default {
  props: ['spec', 'name', 'item', 'parent', 'root'],
  data() {
    return {
      object: this.item,
      attachment: this.item && typeof(this.item[this.name]) === 'object' ? this.item[this.name] : null
    }
  },
  mounted () {
    // this.attachment = this.object[this.name]
    // if (!Array.isArray(this.object[this.name])) {
    //   this.object[this.name] = []
    // } else {
    //   this.object[this.name] = this.object[this.name].filter(attachment => attachment.key)
    // }
    // this.object[this.name].forEach(attachment => this.attachments.push(attachment))
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
            this.object[this.name] = Attachments.serialize(attachment)
            this.$emit('update', this.name, this.object[this.name])

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
        this.object[this.name] = null
        this.attachment = null
        this.$emit('update', this.name, this.object[this.name])

        // HACK: Save when a new image is uploaded or it may be lost in space
        //this.designerStore.save(this)
      }
    }
  }
}
</script>

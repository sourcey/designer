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
  //- div {{attachments.length}}
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
      attachments: [], //this.item[this.name],
    }
  },
  mounted () {
    if (!Array.isArray(this.object[this.name])) {
      this.object[this.name] = []
    }
    // else {
    //   this.object[this.name] = this.object[this.name].filter(attachment => attachment.key)
    // }
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

        // Add the object to the proxy `attachments` array.
        // It wont be added to the main object until the upload has succeeded.
        this.attachments.push(attachment)
        Attachments.upload(attachment)
          .then(() => {
            // HACK: Calling `push` is not triggering reactivity across frame borders,
            // so the instance must be reassigned.
            // this.object[this.name].push(Attachments.serialize(attachment))

            // this.object[this.name] = this.attachments

            console.log('SUCCESSSSSSSSSSS', this.object[this.name], this.attachments, Attachments.serialize(attachment))
            // this.$emit('update', this.name, this.object[this.name])
            this.update()
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
    update () {
      // HACK: Calling `push` or `splice` on the array is not triggering reactivity
      // across frame borders, but reassigning the instance does the trick.
      this.object[this.name] = this.attachments.map(attachment => Attachments.serialize(attachment))
      this.$emit('update', this.name, this.object[this.name])
    },
    removeAttachment (attachment) {
      if (confirm("Are you sure?")) {

        // Delete from server
        if (attachment.key)
          Attachments.destroy(attachment)

        // Remove from object data
        // const ia = this.object[this.name].findIndex(x => Object.is(x, attachment))
        // if (ia !== -1) this.object[this.name].splice(ia, 1)
        // for (let i = 0; i < this.object[this.name].length; i++) {
        //   // if (this.object[this.name][i].key === attachment.key) {
        //   if (Object.is(this.object[this.name][i], attachment)) {
        //     this.object[this.name].splice(i, 1)
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

        // HACK: Reassign the object variable. This seems to me the only way to
        // trigger reactivity across the preview frame border.
        // this.object[this.name] = this.attachments

        // console.log('DELETTTTTTTTTT', ib, this.object[this.name], this.attachments)

        this.update()
        // this.$emit('update', this.name, this.object[this.name])

        // HACK: Save when a image is deleted or it may be lost in space
        //this.designerStore.save(this)
      }
    }
  }
}
</script>

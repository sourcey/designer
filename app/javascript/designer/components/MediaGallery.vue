<template lang="pug">
#gallery.designer-attachment-input
  //- div {{ attachments }}
  header.pt-15
    .form-title Media Gallery
    button.btn.btn-sm.btn-success.btn-upload
      designer-icon(name='plus')
      span Upload
      input.input-file(type='file' multiple='' accept="image/*" @change='filesChange')
  table.table.table-hover
    thead
      tr
        th(style='width:80px')
        th Name
        //- th Size
        //- th Status
        th
    tbody
      tr(v-if='!attachments.length')
        td(colspan='7')
          .text-center.p-5
            h4
              | Drop attachments anywhere to upload
              br
              | or
            label.btn.btn-lg.btn-success(:for='name') Select Files
      tr(v-for='(attachment, index) in attachments' :key='attachment.id')
        // <td>{{index}}</td>
        td

          img.img-fluid(v-if='attachment.thumbnail' :src='attachment.thumbnail')
          img.img-fluid(v-else-if='attachment.key' :src='designerStore.attachmentThumbnailUrl(attachment)')
          //- img(v-if='attachment.thumbnail || attachment.thumbnail_url' :src='attachment.thumbnail || attachment.thumbnail_url' width='50' height='auto')
          //- span(v-else='') No Image
        td
          .filename {{ attachment.filename }}
          .text-danger(v-if='attachment.error') {{ attachment.error }}
          .loader.spinner-border(v-else-if='!attachment.key' role='status')
            span.sr-only Loading...
          .small.text-muted(v-else)
            div(v-if='attachment.byte_size') {{ attachment.byte_size | humanSize }}
            div {{ attachment.content_type}}
          //- br
          //- em {{attachment.kind}}
          //- .progress(v-if="attachment.active || attachment.progress && attachment.progress !== '0.00'")
            div(:class="{'progress-bar': true, 'progress-bar-striped': true, 'bg-danger': attachment.error, 'progress-bar-animated': attachment.active}" role='progressbar' :style="{width: attachment.progress + '%'}") {{attachment.progress}}%
        //- td
        //- <td v-if="attachment.speed">{{attachment.speed | humanSize}}</td>
        //- <td v-else></td>
        //- td(v-if='attachment.error') {{ attachment.error }}
        //- td(v-else-if='attachment.persisted') persisted
        //- td(v-else-if='attachment.success') success
        //- td(v-else-if='attachment.active') active
        //- td(v-else='')
        //- td
        td(align='right')
          b-dropdown(variant='icon btn-text-secondary' size='sm' no-caret)
            template(slot='button-content')
              i.fas.fa-ellipsis-v
            //- div(v-if='!attachment.persisted && !attachment.success')
              //- b-dropdown-item(v-if='designerState.enableElementEmbeds' href='#' @click='copyToClipboard(getEmbedCode(item.id))') Copy embed code
              //- b-dropdown-item(:class="{disabled: !attachment.active}" href='#' @click.prevent="attachment.active ? $refs.upload.update(file, {error: 'cancel'}) : false") Cancel
              //- a.dropdown-item(href='#' v-if='attachment.active' @click.prevent='$refs.upload.update(file, {active: false})') Abort
              a.dropdown-item(href='#' v-else-if="attachment.error && attachment.error !== 'compressing' && $refs.upload.features.html5" @click.prevent="$refs.upload.update(file, {active: true, error: '', progress: '0.00'})") Retry upload
              a(:class="{'dropdown-item': true, disabled: attachment.success || attachment.error === 'compressing'}" href='#' v-else='' @click.prevent="attachment.success || attachment.error === 'compressing' ? false : $refs.upload.update(file, {active: true})") Upload
              .dropdown-divider
              a.dropdown-item(href='#' @click.prevent='removeFile(index)') Remove
            //- .dropdown-menu(v-else='')
            b-dropdown-item(@click='copyToClipboard(attachment.key)') Copy key
            b-dropdown-divider
            b-dropdown-item.text-danger(@click='removeAttachment(attachment)') Remove
          //- .btn-group.btn-group-sm
            button.btn.btn-secondary.btn-sm.dropdown-toggle(data-toggle='dropdown' type='button')
            .dropdown-menu(v-if='!attachment.persisted && !attachment.success')
              // <a :class="{'dropdown-item': true, disabled: attachment.active || attachment.success || attachment.error === 'compressing'}" href="#" @click.prevent="attachment.active || attachment.success || attachment.error === 'compressing' ? false :  onEditFileShow(file)">Edit</a>
              a(:class="{'dropdown-item': true, disabled: !attachment.active}" href='#' @click.prevent="attachment.active ? $refs.upload.update(file, {error: 'cancel'}) : false") Cancel
              a.dropdown-item(href='#' v-if='attachment.active' @click.prevent='$refs.upload.update(file, {active: false})') Abort
              a.dropdown-item(href='#' v-else-if="attachment.error && attachment.error !== 'compressing' && $refs.upload.features.html5" @click.prevent="$refs.upload.update(file, {active: true, error: '', progress: '0.00'})") Retry upload
              a(:class="{'dropdown-item': true, disabled: attachment.success || attachment.error === 'compressing'}" href='#' v-else='' @click.prevent="attachment.success || attachment.error === 'compressing' ? false : $refs.upload.update(file, {active: true})") Upload
              .dropdown-divider
              a.dropdown-item(href='#' @click.prevent='removeFile(index)') Remove
            .dropdown-menu(v-else='')
              a.dropdown-item(href='#' @click.prevent='copyToClipboard(attachment.key)') Copy key
              .dropdown-divider
              a.dropdown-item(href='#' @click.prevent='removeFile(index)') Remove

  //- .form-row(v-if='attachments.length')
    //- .preview-items.clearfix.mt-1
    .col-4.col-lg-3(v-for='(attachment, index) in attachments')
      .preview-item.mt-05
        .overlay.center-container.h-100
          .error.text-danger(v-if='attachment.error' v-b-tooltip :title='attachment.error')
            i.fas.fa-exclamation-triangle
          .loader.spinner-border(v-else-if='!attachment.key' role='status')
            span.sr-only Loading...
        a.delete(v-if='attachment.key' href='#' @click.prevent='removeAttachment(attachment)')
          i.fas.fa-times
        img.img-fluid(v-if='attachment.thumbnail' :src='attachment.thumbnail')
        img.img-fluid(v-else-if='attachment.key' :src='designerStore.attachmentThumbnailUrl(attachment)')
</template>

<script>
// import Attachments from '../../mixins/attachments'

export default {
  // props: ['spec', 'name', 'item', 'parent', 'root'],
  // mixins: [Attachments],
  // data() {
  //   return {
  //     object: this.item, // || {}
  //     // attachments: [],
  //   }
  // },
  mounted () {
    // if (!Array.isArray(this.object[this.name])) {
    //   this.object[this.name] = []
    // } else {
    //   this.object[this.name] = this.object[this.name].filter(attachment => attachment.key)
    // }
    // this.object[this.name].forEach(attachment => this.attachments.push(attachment))
  },
  computed: {
    attachments () {
      return this.designerState.attachments
    },
    // validateMax () {
    //   if (this.spec.validate &&
    //     this.spec.validate.max &&
    //     this.attachments.length >= this.spec.validate.max)
    //     return true
    //   return false
    // },
  },
  methods: {
    filesChange(event) {
      console.log('attachments added', event.target.files)

      Array.from(event.target.files).forEach(file => {
        let attachment = { file: file }
        this.attachments.push(attachment)
        Attachments.upload(attachment)
          .then(() => {

            // Store the data we want on the object
            // this.object[this.name].push({
            //   key: attachment.key,
            //   signed_id: attachment.signed_id,
            //   filename: attachment.filename,
            //   size: attachment.size,
            //   content_type: attachment.content_type
            // })
            this.$toast.success("Image uploaded successfuly")
            this.$emit('upload', attachment)

            // HACK: Save when an image is uploaded or it may be lost in space
            this.designerStore.save(this)
          })
      })
    },
    removeAttachment (attachment) {
      if (confirm("Are you sure?")) {

        // Delete from server
        Attachments.destroy(attachment)

        // Remove from object data
        // for (let i = 0; i < this.object[this.name].length; i++) {
        //   if (this.object[this.name][i].key === attachment.key) {
        //     this.object[this.name].splice(i, 1)
        //     break
        //   }
        // }

        // Remove from attachments
        for (let i = 0; i < this.attachments.length; i++) {
          if (this.attachments[i].key === attachment.key) {
            this.attachments.splice(i, 1)
            break
          }
        }

        this.$toast.success("Image deleted successfuly")
        this.$emit('delete', attachment)

        // HACK: Save when a image is deleted or it may be lost in space
        // this.designerStore.save(this)
      }
    }
  }
}
</script>

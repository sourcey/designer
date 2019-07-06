<template lang="pug">
.item-wrap.trix-text-input
  //
    <br>name: >>>
    <br>{{name}}
    <br>spec: >>>
    <br>{{spec}}
  //
    <br>object[name]: >>>
    <br>{{object[name]}}
  .form-group
    label(v-if='spec.label !== false', :for='inputName') {{ itemLabel }}
    .editor
      trix-toolbar(:id='toolbarName')
        .trix-button-row
          span.trix-button-group.trix-button-group--text-tools(data-trix-button-group='text-tools')
            button.trix-button.trix-button--icon.trix-button--icon-bold(type='button', data-trix-attribute='bold', data-trix-key='b', :title='trixLang.bold', tabindex='-1')
            button.trix-button.trix-button--icon.trix-button--icon-italic(type='button', data-trix-attribute='italic', data-trix-key='i', :title='trixLang.italic', tabindex='-1')
            // <button type="button" class="trix-button trix-button--icon trix-button--icon-strike" data-trix-attribute="strike" :title="trixLang.strike" tabindex="-1">trixLang.strike}</button>
            button.trix-button.trix-button--icon.trix-button--icon-link(type='button', data-trix-attribute='href', data-trix-action='link', data-trix-key='k', :title='trixLang.link', tabindex='-1')
            //
              </span>
              <span class="trix-button-group trix-button-group--element-tools" data-trix-button-group="element-tools">
            button.trix-button.trix-button--icon.trix-button--icon-heading-1(type='button', data-trix-attribute='heading1', :title='trixLang.heading1', tabindex='-1')
            button.trix-button.trix-button--icon.trix-button--icon-quote(type='button', data-trix-attribute='quote', :title='trixLang.quote', tabindex='-1')
            // <button type="button" class="trix-button trix-button--icon trix-button--icon-code" data-trix-attribute="code" :title="trixLang.code" tabindex="-1">trixLang.code}</button>
            button.trix-button.trix-button--icon.trix-button--icon-bullet-list(type='button', data-trix-attribute='bullet', :title='trixLang.bullets', tabindex='-1')
            button.trix-button.trix-button--icon.trix-button--icon-number-list(type='button', data-trix-attribute='number', :title='trixLang.numbers', tabindex='-1')
            // <button type="button" class="trix-button trix-button--icon trix-button--icon-decrease-nesting-level" data-trix-action="decreaseNestingLevel" :title="trixLang.outdent" tabindex="-1">trixLang.outdent}</button>
            // <button type="button" class="trix-button trix-button--icon trix-button--icon-increase-nesting-level" data-trix-action="increaseNestingLevel" :title="trixLang.indent" tabindex="-1">trixLang.indent}</button>
          span.trix-button-group-spacer
          //
            <span class="trix-button-group trix-button-group--history-tools" data-trix-button-group="history-tools">
            <button type="button" class="trix-button trix-button--icon trix-button--icon-undo" data-trix-action="undo" data-trix-key="z" :title="trixLang.undo" tabindex="-1">trixLang.undo}</button>
            <button type="button" class="trix-button trix-button--icon trix-button--icon-redo" data-trix-action="redo" data-trix-key="shift+z" :title="trixLang.redo" tabindex="-1">trixLang.redo}</button>
            </span>
          span.trix-button-group.trix-button-group--fullscreen(data-trix-button-group='fullscreen')
            button.trix-button.trix-button--icon.trix-button--icon-fullscreen(type='button', @click='doToggleFullscreen', data-trix-key='f', title='Fullscreen', tabindex='-1')
              i.fas.fa-expand-arrows-alt
        .trix-dialogs(data-trix-dialogs='')
          .trix-dialog.trix-dialog--link(data-trix-dialog='href', data-trix-dialog-attribute='href')
            .trix-dialog__link-fields
              input.trix-input.trix-input--dialog(type='url', name='href', placeholder='trixLang.urlPlaceholder', aria-label='trixLang.url', required='', data-trix-input='')
              .trix-button-group
                input.trix-button.trix-button--dialog(type='button', :value='trixLang.link', data-trix-method='setAttribute')
                input.trix-button.trix-button--dialog(type='button', :value='trixLang.unlink', data-trix-method='removeAttribute')
      trix-editor.trix-content(ref='trix', resize='vertical', :input='inputName', :toolbar='toolbarName', :placeholder="spec.placeholder || 'Enter content...'", @trix-change='update', @trix-attachment-add='emitAttachmentAdd', @trix-attachment-remove='emitAttachmentRemove')
      input(type='hidden', :id='inputName', v-model='object[name]', @input='update')
</template>

<script>
import Vue from 'vue'
// import Attachments from '../../mixins/attachments'
import Trix from 'trix'
import { randomString, toggleFullscreen } from '../../../designer/utils'

Vue.config.ignoredElements = ['trix-editor', 'trix-toolbar']


export default {
  props: ['spec', 'name', 'object', 'parent', 'root'],
  // mixins: [Attachments],
  data () {
    return {
      trixLang: Trix.config.lang,
      object: this.model // || {}
      // object: this.model && this.model[this.name] ?
      //   this.model[this.name] :
      //   this.$set(this.model, this.name, null) // make it reactive
      //   // this.spec.default
    }
  },
  computed: {
    inputName () {
      return 'input-' + this.name + randomString(5)
    },
    toolbarName () {
      return 'trix-toolbar-' + this.name + randomString(5)
    }
  },
  mounted () {
    // $('.trix-button-row').append()
    // const buttonHTML = '<button type="button" class="trix-button trix-button--icon trix-button--icon-fullscreen" title="Fullscreen" tabindex="-1"><i class="fas fa-expand-arrows-alt"></i></button>'
    //  // trix-button--icon-bullet-list data-trix-attribute="bullet"
    // const groupElement = this.$el.querySelector('.trix-button-group--history-tools')
    // groupElement.insertAdjacentHTML('beforeend', buttonHTML)
    // toggleFullscreen

    // document.addEventListener("action-invoke", function(event) {
    //     console.log("Log called", event);
    //     alert('bbb')
    //     if(event.actionName === "x-log"){
    //         console.log("Log called");
    //     }
    // })
    // document.addEventListener("trix-action-invoke", function(event) {
    //     console.log("Log called", event);
    //     alert('aaa')
    //     if(event.actionName === "x-log"){
    //         console.log("Log called");
    //     }
    // })
  },
  methods: {
    update (event) {
      console.log('trix input: update', event.srcElement.innerHTML)
      this.object[this.name] = event.srcElement.innerHTML
      this.$emit('update', this.name, this.object[this.name])
    },

    emitAttachmentAdd (event) {
      const { attachment, target } = event

      console.log('trix input: attachemnt add', attachment)

      attachment.metadata = this.fileMetadata ()

      // Sanity check
      if (this.root && this.parent && // && this.root.elements
        !attachment.metadata.designer_element_id) {
        alert('Could not associate attachment with element')
        return
      }

      Attachments.upload(attachment)
        .then(attributes => {

          console.log('trix input: upload complete', attributes)
          attachment.setAttributes({
            signed_id: attributes.signed_id,
            key: attributes.key,
            url: this.attachmentCdnUrl(attributes)
          })
        })
      // this.upload({
      //   attachment: attachment,
      //   file: attachment.file
      // })
    },

    // onThumbnailCreated (attributes, thumbnail) {
    //   const { attachment } = attributes
    //
    //   // attachment.setAttributes({
    //   //   url: thumbnail
    //   // })
    // },

    // onUploadComplete (error, attributes) {
    //   if (!error) {
    //     const { attachment } = attributes
    //
    //     console.log('trix input: upload complete', attributes)
    //     attachment.setAttributes({
    //       signed_id: attributes.signed_id,
    //       key: attributes.key,
    //       url: this.attachmentCdnUrl(attributes)
    //     })
    //   }
    //   //
    //   // // HACK: Save when a new image is uploaded or it may be lost in space
    //   // this.designerStore.save(this)
    // },

    emitAttachmentRemove (event) {
      const { attachment, target } = event

      console.log('trix input: attachemnt remove', attachment)
      this.destroy(attachment.getAttributes())
      // this.$emit('trix-attachment-remove', file)
    },

    doToggleFullscreen (event) {
        console.log("Log called", event);
      // if (event.actionName === 'fullscreen') {
        toggleFullscreen(this.$el)
      // }
      // this.$emit('trix-attachment-remove', file)
    },
    // emitHandleFile (file) {
    //   console.log('trix input: attachemnt handle', file)
    //   // this.$emit('trix-attachment-add', file)
    // },
    // saveEditorState (value) {
    //   console.log('trix input: save state', value)
    // }
    // onPickerChange (value) {
    //   console.log('color input: picker changed', name, value)
    //   // this.object[this.name] = value
    //   this.object = value
    //   this.$emit('update', this.name, value)
    // }
  },
  // watch: {
  //   editorContent: {
  //     handler: 'saveEditorState'
  //   }
  // }
}
</script>

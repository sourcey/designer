<template lang="pug">
.item-wrap.markdown-text-input
  //- //
    <br>object: >>>
    <br>{{object}}
    <br>spec: >>>
    <br>{{spec}}
  .form-group
    //- (v-if="spec.type === 'string' && spec.multiline")
    //- a.float-right(href='#' @click="openMarkdownEditor()")
      i.fa.fa-edit
    label.form-label(v-if='spec.label !== false' :for='inputId' v-b-tooltip :title='spec.hint') {{ inputLabel }}
    textarea.form-control(:id='inputId' ref='textarea' rows='5'
        v-model='object[name]'
        :placeholder='spec.placeholder'
        @focusin='emitSelect'
        @input="$emit('update', name, object[name])")
</template>

<script>
import Input from '../../mixins/input'
import SimpleMDE from 'simplemde/dist/simplemde.min'
import { randomString } from '../../utils'
// import Vue from 'vue'
// import FormLabel from '../FormLabel'
// import MarkdownEditor from '../markdown'


export default {
  extends: Input,
  mounted() {
    this.openMarkdownEditor()
  },
  methods: {
    createEditor () {
      if (this.mde)
        return
      this.mde = new SimpleMDE({
        element: this.$refs.textarea,
        // forceSync: true,
        autoDownloadFontAwesome: false,
        toolbar: ['bold', 'italic', 'strikethrough', 'heading', '|',
              'unordered-list', 'ordered-list', 'quote', 'code', 'table', 'link', '|',
              'clean-block', 'fullscreen']
      })

      // console.log(this.mde.gui.toolbar)
      // $(this.mde.gui.toolbar).find('.fa-header').attr('class', 'fa fa-heading')
      this.mde.gui.toolbar.querySelector('.fa-header').className = 'fa fa-heading'

      this.mde.codemirror.on('drop', function(cm, event) {
        const id = event.dataTransfer.getData('id')
        const embed = event.dataTransfer.getData('embed')
        console.log('handleDrop', cm, event, id, embed)

        var coords = cm.coordsChar({ left: event.x, top: event.y })
        cm.replaceRange(embed, coords)
        // event.preventDefault()
      })
    },

    // import TrixEditor from '../editors/trix'
    openMarkdownEditor () {
      this.createEditor()
      // let editor = new TrixEditor($modal.find('textarea')[0])
      // editor.mde.value($textarea.val())
      // $modal.modal('show')
      //
      // function updateEditorHeight() {
      //   $modal.find('.CodeMirror').height($modal.height())
      // }
      // updateEditorHeight()
      // $(window).on('resize', updateEditorHeight)

      // editor.mde.codemirror.on('change', function() {
      //   $textarea.val(editor.value())
      //
      //   $textarea[0].dispatchEvent(new Event('input', { bubbles: true }));
      //   $textarea[0].dispatchEvent(new Event('change', { bubbles: true }));
      // })
      //
      // $modal.on('hidden.bs.modal', function(e) {
      //   editor.destroy()
      //   $(window).off('resize', updateEditorHeight)
      // })
    }
  }
}
</script>

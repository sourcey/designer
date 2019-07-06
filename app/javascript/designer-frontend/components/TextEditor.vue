<template lang="pug">
.editor
  editor-menu-bar(:editor='editor' ref='menu')
    .menubar(v-if='simpleMode' :style='{left: "-" + leftOffset + "px"}' :class="{ 'is-hidden': !focused }", slot-scope='{ commands, isActive }')
      button.menubar__button(:class="{ 'is-active': isActive.bold() }", @click='commands.bold')
        icon(name='bold' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.italic() }", @click='commands.italic')
        icon(name='italic' size='12')
    .menubar(v-else :style='{left: "-" + leftOffset + "px"}' :class="{ 'is-hidden': !focused }", slot-scope='{ commands, isActive }')
      button.menubar__button(:class="{ 'is-active': isActive.bold() }", @click='commands.bold')
        icon(name='bold' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.italic() }", @click='commands.italic')
        icon(name='italic' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.strike() }", @click='commands.strike')
        icon(name='strike' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.underline() }", @click='commands.underline')
        icon(name='underline' size='12')
      //- button.menubar__button(:class="{ 'is-active': isActive.code() }", @click='commands.code')
      //-   icon(name='code' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.paragraph() }", @click='commands.paragraph')
        icon(name='paragraph' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.heading({ level: 1 }) }", @click='commands.heading({ level: 1 })')
        | H1
      button.menubar__button(:class="{ 'is-active': isActive.heading({ level: 2 }) }", @click='commands.heading({ level: 2 })')
        | H2
      button.menubar__button(:class="{ 'is-active': isActive.heading({ level: 3 }) }", @click='commands.heading({ level: 3 })')
        | H3
      button.menubar__button(:class="{ 'is-active': isActive.bullet_list() }", @click='commands.bullet_list')
        icon(name='ul' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.ordered_list() }", @click='commands.ordered_list')
        icon(name='ol' size='12')
      //- button.menubar__button(:class="{ 'is-active': isActive.blockquote() }", @click='commands.blockquote')
      //-   icon(name='quote' size='12')
      //- button.menubar__button(:class="{ 'is-active': isActive.code_block() }", @click='commands.code_block')
      //-   icon(name='code' size='12')
      //- button.menubar__button(@click='commands.horizontal_rule')
      //-   icon(name='hr' size='12')
      button.menubar__button(@click='commands.undo')
        icon(name='undo' size='12')
      button.menubar__button(@click='commands.redo')
        icon(name='redo' size='12')
  editor-content(:editor='editor' :class='contentClass')
  //- .text-content
</template>

<script>
// import Icon from 'designer/app/javascript/designer/components/SvgIcon.vue'
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  // Blockquote,
  // CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  // TodoItem,
  // TodoList,
  Bold,
  // Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Placeholder,
} from 'tiptap-extensions'

import '../assets/images/editor/bold.svg'
import '../assets/images/editor/italic.svg'
import '../assets/images/editor/strike.svg'
import '../assets/images/editor/underline.svg'
import '../assets/images/editor/code.svg'
import '../assets/images/editor/paragraph.svg'
import '../assets/images/editor/ul.svg'
import '../assets/images/editor/ol.svg'
import '../assets/images/editor/quote.svg'
import '../assets/images/editor/code.svg'
import '../assets/images/editor/hr.svg'
import '../assets/images/editor/undo.svg'
import '../assets/images/editor/redo.svg'

export default {
  components: {
    EditorContent,
    EditorMenuBar,
    Icon,
  },
  props: {
    content: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: 'Write here …'
    },
    contentClass: {
      type: String,
      default: null
    },
    simpleMode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // editorContent: this.content,
      editor: new Editor({
        extensions: [
          // new Blockquote(),
          new BulletList(),
          // new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          // new TodoItem(),
          // new TodoList(),
          new Bold(),
          // new Code(),
          new Italic(),
          new Link(),
          new Strike(),
          new Underline(),
          new History(),
          new Placeholder({
            emptyClass: 'is-empty',
            emptyNodeText: this.placeholder,
            showOnlyWhenEditable: true,
          }),
        ],
        content: this.content,
        onFocus: () => {
          this.onFocused(true)
        }
      }),
      focused: false,
      leftOffset: 0
    }
  },
  mounted() {
  // console.log('text editor: create', this.$refs)
    window.addEventListener('click', this.onWindowClick)
  },
  beforeDestroy() {
    this.editor.destroy()
    window.removeEventListener('click', this.onWindowClick)
    // console.log('text editor: destroy')
  },
  methods: {
    onFocused (flag) {
      // const menuRect = this.$refs.menu.$el.getBoundingClientRect()

      // console.log('text editor: focused', flag)
      this.autoPosition()
      this.focused = flag
      this.$emit('focused', flag)
      this.$emit('update', this.editor.getHTML())
    },
    onWindowClick (event) {
      if (!this.$el.contains(event.target)) {
        this.onFocused(false)
      }
    },
    autoPosition () {
      const viewWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      const parentRect = this.$parent.$el.getBoundingClientRect()
      const menuRect = this.$refs.menu.$el.getBoundingClientRect()
      const overflow = (parentRect.left + menuRect.width) - viewWidth
      // console.log('text editor: update position', overflow)
      if (overflow > 0) {
        this.leftOffset = overflow
      } else {
        this.leftOffset = 0
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/_mixins.scss';

.menubar {
  position: absolute;
  top: -26px;
  left: 0;
}
</style>

<template lang="pug">
.wysiwyg(:class="{ focused: focused }")
  //- v-show='!hideMenu'
  editor-menu-bubble(:editor='editor' :keep-in-bounds='true' ref='menu' v-slot="{ commands, isActive, menu }")
    //- .menubar(v-if='mode === "basic"' :style='{left: "-" + leftOffset + "px", bottom: menu.bottom + "px"}' :class="{ 'is-hidden': !focused }")
    .menubar(v-if='mode === "basic"' :style='{left: "-" + leftOffset + "px", bottom: menu.bottom + "px"}' :class="{ 'is-active': menu.isActive }")
      button.menubar__button(:class="{ 'is-active': isActive.bold() }" @click='commands.bold')
        icon(name='editor-bold' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.italic() }" @click='commands.italic')
        icon(name='editor-italic' size='12')
    //- .menubar(v-else :style='{left: "-" + leftOffset + "px", bottom: menu.bottom + "px"}' :class="{ 'is-hidden': !focused }")
    .menubar(v-else :style='{left: "-" + leftOffset + "px", bottom: menu.bottom + "px"}' :class="{ 'is-active': menu.isActive }")
      button.menubar__button(:class="{ 'is-active': isActive.bold() }" @click='commands.bold')
        icon(name='editor-bold' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.italic() }" @click='commands.italic')
        icon(name='editor-italic' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.strike() }" @click='commands.strike')
        icon(name='editor-strike' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.underline() }" @click='commands.underline')
        icon(name='editor-underline' size='12')
      //- button.menubar__button(:class="{ 'is-active': isActive.code() }" @click='commands.code')
      //- //-   icon(name='editor-code' size='12')
      //- button.menubar__button(:class="{ 'is-active': isActive.paragraph() }" @click='commands.paragraph')
      //-   icon(name='editor-paragraph' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.heading({ level: 1 }) }" @click='commands.heading({ level: 1 })')
        | H1
      button.menubar__button(:class="{ 'is-active': isActive.heading({ level: 2 }) }" @click='commands.heading({ level: 2 })')
        | H2
      button.menubar__button(:class="{ 'is-active': isActive.heading({ level: 3 }) }" @click='commands.heading({ level: 3 })')
        | H3
      button.menubar__button(:class="{ 'is-active': isActive.bullet_list() }" @click='commands.bullet_list')
        icon(name='editor-ul' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.ordered_list() }" @click='commands.ordered_list')
        icon(name='editor-ol' size='12')
      //- button.menubar__button(:class="{ 'is-active': isActive.blockquote() }" @click='commands.blockquote')
      //-   icon(name='editor-quote' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.code_block() }" @click='commands.code_block')
        icon(name='editor-code' size='12')
      //- button.menubar__button(@click='commands.horizontal_rule')
      //-   icon(name='editor-hr' size='12')
      button.menubar__button(@click='commands.undo')
        icon(name='editor-undo' size='12')
      button.menubar__button(@click='commands.redo')
        icon(name='editor-redo' size='12')
      button.menubar__button(@click='commands.figure()')
        icon(name='editor-image' size='12')
      button.menubar__button(@click='commands.quote()')
        icon(name='editor-quote' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.citation() }" @click='commands.citation()') cite
      //- button.menubar__button(@click='commands.figure') image{src: "#"}
      //- icon(name='editor-redo' size='12')
      //- button class="menubar__button" @click="commands.figure({src: placeholderSrc})">
      //-     <span>image</span>
      //-   </button>
  editor-content(:editor='editor' :class='contentClass')
  //- .text-content
</template>

<script>
import {
  Editor,
  EditorContent,
  EditorMenuBubble } from 'tiptap'
import {
  // Blockquote,
  CodeBlock,
  HardBreak,
  // Heading,
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
  Placeholder
} from 'tiptap-extensions'
import {
  Division,
  Heading,
  Figure,
  Figcaption,
  Blockquote,
  Citation
} from '../assets/scripts/tiptap/extensions';

import '../assets/images/editor/bold.svg?sprite=true'
import '../assets/images/editor/italic.svg?sprite=true'
import '../assets/images/editor/strike.svg?sprite=true'
import '../assets/images/editor/underline.svg?sprite=true'
import '../assets/images/editor/code.svg?sprite=true'
import '../assets/images/editor/paragraph.svg?sprite=true'
import '../assets/images/editor/ul.svg?sprite=true'
import '../assets/images/editor/ol.svg?sprite=true'
import '../assets/images/editor/quote.svg?sprite=true'
import '../assets/images/editor/image.svg?sprite=true'
import '../assets/images/editor/code.svg?sprite=true'
import '../assets/images/editor/hr.svg?sprite=true'
import '../assets/images/editor/undo.svg?sprite=true'
import '../assets/images/editor/redo.svg?sprite=true'
import '../assets/images/editor/at.svg?sprite=true'
import '../assets/images/editor/widget-regular.svg?sprite=true'
import '../assets/images/editor/widget-wide.svg?sprite=true'
import '../assets/images/editor/widget-full.svg?sprite=true'
import '../assets/images/editor/widget-left.svg?sprite=true'
import '../assets/images/editor/widget-left-breakout.svg?sprite=true'
import '../assets/images/editor/widget-right.svg?sprite=true'
import '../assets/images/editor/widget-replace.svg?sprite=true'

export default {
  name: 'text-editor',
  components: {
    EditorContent,
    EditorMenuBubble
  },
  props: {
    content: {
      type: String,
      default: null
    },
    mode: {
      type: String,
      default: 'full'
    },
    placeholder: {
      type: String,
      default: 'Write here …'
    },
    contentClass: {
      type: [String, Array],
      default: null
    },
    contentTag: {
      type: String,
      default: null
    },
    hideMenu: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editor: new Editor({
        extensions: [
          // new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          // new Heading({ levels: [1, 2, 3] }),
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

          // Custom extensions
          new Division(),
          new Heading({ levels: [1, 2, 3, 4, 5, 6] }),
          new Figure(),
          new Figcaption(),
          new Blockquote(),
          new Citation()
        ],

        // content: this.content,
        content: this.contentHtml(),
        onFocus: () => this.onFocused(true)
      }),
      focused: false,
      leftOffset: 0,
      topOffset: 0
    }
  },
  mounted () {
    window.addEventListener('click', this.onWindowClick)

    // console.log('text editor: create', this.contentHtml())
    // this.editor.commands.heading({ level: 1 })
  },
  beforeDestroy () {
    this.editor.destroy()
    window.removeEventListener('click', this.onWindowClick)
  },
  methods: {
    contentHtml () {
      if (this.contentTag) {
        const classNames =
            Array.isArray(this.contentClass) ? this.contentClass.join(' ') :
              this.contentClass ? this.contentClass : ''
        // console.log('CONTENT HTML TAG',
        //   `<${this.contentTag} class="${classNames}">${this.stripTags(this.content)}</${this.contentTag}>`)
        return `<${this.contentTag} class="${classNames}">${this.stripTags(this.content)}</${this.contentTag}>`
      }
      return this.content
    },
    editorHtml () {
      let html = this.editor.getHTML()
      if (this.contentTag)
        html = this.stripTags(html)
      return html
    },
    stripTags (value) {
      if (value)
        return value.replace(/<\/?[^>]+(>|$)/g, "")
      return ''
    },
    onFocused (flag) {
      // let html = this.editor.getHTML()
      // if (this.contentTag)
      //   html = this.stripTags(html)
      let html = this.editorHtml()
      console.log('text editor: focused', flag) //, html
      this.autoPosition()
      this.focused = flag
      this.$emit('focused', flag)
      this.$emit('update', html)
    },
    onWindowClick (event) {
      if (this.focused && !this.$el.contains(event.target)) {
        this.onFocused(false)
      }
    },
    autoPosition () {
      if (this.hideMenu) return
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
  },
  watch: {
  	contentTag: function(value) {
      // console.log('$$$ text editor: contentTag changed', value)
      this.editor.setContent(this.contentHtml())
    },
  	contentClass: function(value) {
      // console.log('$$$ text editor: contentClass changed', value)
      this.editor.setContent(this.contentHtml())
    },
  }
}
</script>

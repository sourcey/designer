<template lang="pug">
.wysiwyg(:class="{ focused: focused }")
  editor-menu-bar(v-if='!hideMenu' :editor='editor' ref='menu')
    .menubar(v-if='mode === "basic"' :style='{left: "-" + leftOffset + "px"}' :class="{ 'is-hidden': !focused }" slot-scope='{ commands, isActive }')
      button.menubar__button(:class="{ 'is-active': isActive.bold() }" @click='commands.bold')
        icon(name='bold' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.italic() }" @click='commands.italic')
        icon(name='italic' size='12')
    .menubar(v-else :style='{left: "-" + leftOffset + "px"}' :class="{ 'is-hidden': !focused }" slot-scope='{ commands, isActive }')
      button.menubar__button(:class="{ 'is-active': isActive.bold() }" @click='commands.bold')
        icon(name='bold' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.italic() }" @click='commands.italic')
        icon(name='italic' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.strike() }" @click='commands.strike')
        icon(name='strike' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.underline() }" @click='commands.underline')
        icon(name='underline' size='12')
      //- button.menubar__button(:class="{ 'is-active': isActive.code() }" @click='commands.code')
      //- //-   icon(name='code' size='12')
      //- button.menubar__button(:class="{ 'is-active': isActive.paragraph() }" @click='commands.paragraph')
      //-   icon(name='paragraph' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.heading({ level: 1 }) }" @click='commands.heading({ level: 1 })')
        | H1
      button.menubar__button(:class="{ 'is-active': isActive.heading({ level: 2 }) }" @click='commands.heading({ level: 2 })')
        | H2
      button.menubar__button(:class="{ 'is-active': isActive.heading({ level: 3 }) }" @click='commands.heading({ level: 3 })')
        | H3
      button.menubar__button(:class="{ 'is-active': isActive.bullet_list() }" @click='commands.bullet_list')
        icon(name='ul' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.ordered_list() }" @click='commands.ordered_list')
        icon(name='ol' size='12')
      //- button.menubar__button(:class="{ 'is-active': isActive.blockquote() }" @click='commands.blockquote')
      //-   icon(name='quote' size='12')
      button.menubar__button(:class="{ 'is-active': isActive.code_block() }" @click='commands.code_block')
        icon(name='code' size='12')
      //- button.menubar__button(@click='commands.horizontal_rule')
      //-   icon(name='hr' size='12')
      button.menubar__button(@click='commands.undo')
        icon(name='undo' size='12')
      button.menubar__button(@click='commands.redo')
        icon(name='redo' size='12')
      button.menubar__button(@click='commands.figure()')
        icon(name='image' size='12')
      button.menubar__button(@click='commands.quote()')
        icon(name='quote' size='12')
      //- button.menubar__button(:class="{ 'is-active': isActive.cite() }" @click='commands.cite') cite
      //- button.menubar__button(@click='commands.figure') image{src: "#"}
      //- icon(name='redo' size='12')
      //- button class="menubar__button" @click="commands.figure({src: placeholderSrc})">
      //-     <span>image</span>
      //-   </button>
  editor-content(:editor='editor' :class='contentClass')
  //- .text-content
</template>

<script>
// import Icon from 'designer/app/javascript/base/components/SvgIcon.vue'
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
// import { default as Heading } from '../assets/scripts/tiptap/nodes/Heading.js'
// import { default as Figure } from '../assets/scripts/tiptap/nodes/Figure.js'
// import { default as Quote } from '../assets/scripts/tiptap/nodes/Quote.js'
// import { default as Citation } from '../assets/scripts/tiptap/marks/Cite.js'

import {
  Division,
  Heading,
  Figure,
  Figcaption,
  Blockquote,
  Cite
} from '../assets/scripts/tiptap/extensions';

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
    EditorMenuBar,
    // Icon,
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
      type: String,
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
      // editorContent: this.content,
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
          new Cite()
        ],

        // content: this.content,
        content: this.contentHtml(),
        onFocus: () => this.onFocused(true)
      }),
      focused: false,
      leftOffset: 0
    }
  },
  mounted() {
    window.addEventListener('click', this.onWindowClick)

    console.log('text editor: create', this.contentHtml())
    // this.editor.commands.heading({ level: 1 })
  },
  beforeDestroy () {
    this.editor.destroy()
    window.removeEventListener('click', this.onWindowClick)
    // console.log('text editor: destroy')
  },
  methods: {
    contentHtml () {
      if (this.contentTag)
        return `<${this.contentTag} class="${this.contentClass || ''}">${this.stripTags(this.content)}</${this.contentTag}>`
      return this.content
    },
    stripTags (value) {
      if (value)
        return value.replace(/<\/?[^>]+(>|$)/g, "")
    },
    onFocused (flag) {
      console.log('text editor: onFocused', this, this.editor)
      let html = this.editor.getHTML()
      if (this.contentTag)
        html = this.stripTags(html)
      console.log('text editor: focused', flag, html)
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
  }
}
</script>

<style scoped lang="scss">
// // @import '@/assets/styles/_variables.scss';
// @import '../assets/styles/_variables.scss';
//
// // @import '../assets/styles/_texy.scss';
//
//
// // Wysiwyg editor
// // --------------------------------------------------
//
// .editor {
//   /deep/ .ProseMirror {
//     outline: 0;
//     // min-height: 300px;
//
//     > *:last-child {
//       margin-bottom: 0;
//     }
//
//     &:not(.ProseMirror-focused) .is-empty:first-child:before {
//       content: attr(data-empty-text);
//       pointer-events: none;
//       height: 0;
//       color: #888;
//     }
//
//     //
//     /// Inline node editor
//
//     .block-editor {
//       white-space: initial;
//       position: relative;
//       min-width: 250px;
//
//       &:not(.selected) .is-empty:before {
//         content: attr(data-empty-text);
//         pointer-events: none;
//         height: 0;
//         color: #888;
//       }
//     }
//
//     figure.block-editor {
//       white-space: initial;
//       position: relative;
//       min-width: 250px;
//
//       .dropzone {
//         display: block;
//         margin: 0;
//       }
//
//       input[type="file"] {
//         opacity: 0;
//         top: 0;
//         position: absolute;
//       }
//     }
//   }
//
//
//   /deep/ .menubar {
//     background-color: $designer-base-color;
//     // margin-bottom: 1rem;
//     line-height: $line-height-base;
//     font-size: $font-size-base;
//     font-family: $font-family-sans-serif;
//     transition: visibility 0.2s 0.4s, opacity 0.2s 0.4s;
//     display: flex;
//     white-space: nowrap;
//     z-index: $zindex-fixed;
//
//     &.is-hidden {
//       visibility: hidden;
//       opacity: 0;
//     }
//
//     &.is-focused {
//       visibility: visible;
//       opacity: 1;
//       transition: visibility 0.2s, opacity 0.2s;
//     }
//
//     &__button {
//       font-weight: bold;
//       // display: inline-block;
//       background: transparent;
//       border: 0;
//       // border-radius: 0;
//       // color: black;
//       color: white;
//       padding: 0 0.75rem;
//       height: 26px;
//       line-height: 26px;
//       margin: 0;
//       font-size: 13px;
//       cursor: pointer;
//
//       svg {
//         fill: white;
//       }
//
//       &:hover {
//         background-color: rgba(white, 0.05);
//       }
//
//       &.is-active {
//         background-color: rgba(white, 0.1);
//       }
//     }
//   }
// }

</style>

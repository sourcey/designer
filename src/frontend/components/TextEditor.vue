<template lang="pug">
.wysiwyg(:class="{ focused: focused }")
  //- v-show='!hideMenu'
  editor-menu-bubble(:editor='editor' :keep-in-bounds='true' ref='menu' v-slot="{ commands, isActive, getMarkAttrs, menu }")
    //- @hide='hideLinkMenu'
    //- .menubar(v-if='mode === "basic"' :style='{left: "-" + menuLeft + "px", bottom: menu.bottom + "px"}' :class="{ 'is-hidden': !focused }")
    .menubar(:style='{left: menuLeftPos(menu.left) + "px", bottom: menu.bottom + "px"}' :class="{ 'is-active': menu.isActive }")
      form.menububble__form(v-if='linkMenuIsActive' @submit.prevent='setLinkUrl(commands.link, linkUrl)')
        input.menububble__input(type='text' v-model='linkUrl' placeholder='https://' ref='linkInput' @keydown.esc='hideLinkMenu')
        button.menububble__button(@click='setLinkUrl(commands.link, null)' type='button')
          icon(name='editor-remove')
      //- v-show='linkMenuIsActive'
      //- .menubar(v-if='mode === "basic"' :style='{left: "-" + menuLeft + "px", bottom: menu.bottom + "px"}' :class="{ 'is-active': menu.isActive }")
      template(v-else-if='mode === "basic"')
        button.menubar__button(:class="{ 'is-active': isActive.bold() }" @click='commands.bold')
          icon(name='editor-bold' size='12')
        button.menubar__button(:class="{ 'is-active': isActive.italic() }" @click='commands.italic')
          icon(name='editor-italic' size='12')
      //- .menubar(v-else :style='{left: menu.left + "px", bottom: menu.bottom + "px"}' :class="{ 'is-active': menu.isActive }")
      //- .menubar(v-else :style='{left: menuLeftPos(menu.left) + "px", bottom: menu.bottom + "px"}' :class="{ 'is-active': menu.isActive }")
      //- form.menububble__form(v-show='linkMenuIsActive' @submit.prevent='setLinkUrl(commands.link, linkUrl)')
        input.menububble__input(type='text' v-model='linkUrl' placeholder='https://' ref='linkInput' @keydown.esc='hideLinkMenu')
        button.menububble__button(@click='setLinkUrl(commands.link, null)' type='button')
          icon(name='editor-remove')
        template(v-show='!linkMenuIsActive')
      template(v-else)
        .d-flex
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
          button.menubar__button(:class="{ 'is-active': getMarkAttrs('align') && getMarkAttrs('align').textAlign === 'center' }" @click='commands.align({ textAlign: "center" })')
            icon(name='editor-align-center' size='12')

          //- <button
          //-     :class="{ 'is-active': getMarkAttrs('align').textAlign === 'center' }"
          //-     @click="commands.align({ textAlign: 'center' })"
          //-     class="menububble__button"
          //- >
          //-     <icon name="align-center" />
          //- </button>
          button.menubar__button(:class="{ 'is-active': isActive.bullet_list() }" @click='commands.bullet_list')
            icon(name='editor-ul' size='12')
          button.menubar__button(:class="{ 'is-active': isActive.ordered_list() }" @click='commands.ordered_list')
            icon(name='editor-ol' size='12')
          //- button.menubar__button(:class="{ 'is-active': isActive.blockquote() }" @click='commands.blockquote')
          //-   icon(name='editor-quote' size='12')

          button.menubar__button(:class="{ 'is-active': isActive.link() }" @click="showLinkMenu(getMarkAttrs('link'))")
            //- span {{ isActive.link() ? &apos;Update Link&apos; : &apos;Add Link&apos;}}
            icon(name='editor-link' size='12')
          button.menubar__button(:class="{ 'is-active': isActive.code_block() }" @click='commands.code_block')
            icon(name='editor-code' size='12')
          //- button.menubar__button(@click='commands.horizontal_rule')
          //-   icon(name='editor-hr' size='12')
          button.menubar__button(@click='commands.figure()')
            icon(name='editor-image' size='12')
          //- button.menubar__button(@click='commands.figure') image{src: "#"}
          //- icon(name='editor-redo' size='12')
          //- button class="menubar__button" @click="commands.figure({src: placeholderSrc})"
        .d-flex
          button.menubar__button(:class="{ 'is-active': isActive.heading({ level: 1 }) }" @click='commands.heading({ level: 1 })')
            | H1
          button.menubar__button(:class="{ 'is-active': isActive.heading({ level: 2 }) }" @click='commands.heading({ level: 2 })')
            | H2
          button.menubar__button(:class="{ 'is-active': isActive.heading({ level: 3 }) }" @click='commands.heading({ level: 3 })')
            | H3
          button.menubar__button(:class="{ 'is-active': isActive.heading({ level: 3 }) }" @click='commands.heading({ level: 4 })')
            | H4
          button.menubar__button(@click='commands.quote()')
            icon(name='editor-quote' size='12')
          button.menubar__button(:class="{ 'is-active': isActive.citation() }" @click='commands.citation()') cite
          .flex-fill
          button.menubar__button(@click='commands.undo')
            icon(name='editor-undo' size='12')
          button.menubar__button(@click='commands.redo')
            icon(name='editor-redo' size='12')
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
  Citation,
  Align
} from '../assets/scripts/tiptap/extensions';

import '../icons'

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
          new Citation(),
          new Align()
        ],

        // content: this.content,
        content: this.contentHtml(),
        onFocus: () => this.onFocused(true)
      }),
      focused: false,
      linkUrl: null,
      linkMenuIsActive: false,
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
          return `<${this.contentTag} class="${classNames}">${this.stripTags(this.content)}</${this.contentTag}>`
      }
      return this.content
    },
    editorHtml () {
      let html = this.editor.getHTML()
      if (this.contentTag)
        html = this.stripTags(html)

      // Process links
      if (html) {
        console.log('text editor: replacing nofollow links')
        html = html.replaceAll('noopener noreferrer nofollow', '')
      }
      // noopener noreferrer nofollow
      return html
    },
    stripTags (value) {
      if (value)
        return value.replace(/<\/?[^>]+(>|$)/g, '')
      return ''
    },
    onFocused (flag) {
      // let html = this.editor.getHTML()
      // if (this.contentTag)
      //   html = this.stripTags(html)
      let html = this.editorHtml()
      console.log('text editor: focused', flag) //, html
      // this.setmenuLeftPosition()
      this.focused = flag
      this.$emit('focused', flag)
      this.$emit('update', html)
    },
    onWindowClick (event) {
      if (this.focused && !this.$el.contains(event.target)) {
        this.onFocused(false)
      }
    },
    menuLeftPos (left) {
      if (!this.$refs.menu || !this.$refs.menu.$el || !this.$refs.menu.$el.getBoundingClientRect)
        return left

      // console.log('text editor: menuLeftPos', left, this.$refs.menu.$el, this.$refs.menu.$el.getBoundingClientRect)
      const viewWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      const parentRect = this.$parent.$el.getBoundingClientRect()
      const menuRect = this.$refs.menu.$el.getBoundingClientRect()

      // Ensure the menu width doesnt exceed the parent
      if ((left + menuRect.width + parentRect.left) > viewWidth)
        return parentRect.width - menuRect.width
      return left
    },
    // setmenuLeftPosition () {
    //   // if (this.hideMenu) return
    //   const viewWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    //   const parentRect = this.$parent.$el.getBoundingClientRect()
    //   const menuRect = this.$refs.menu.$el.getBoundingClientRect()
    //   const menuLeftPos = this.$refs.menu.menu
    //   // const overflow = (parentRect.left + menuRect.width) - viewWidth
    //
    //   // If the menu width is wider than the parent then push it left
    //   const overflow = (menuLeftPos.left + menuRect.width) - viewWidth
    //
    //   console.log('text editor: update position', overflow, this.$refs.menu.menu)
    //
    //   if (overflow > 0) {
    //     this.menuLeft = overflow
    //   } else {
    //     this.menuLeft = menuLeftPos.left
    //   }
    // },
    showLinkMenu(attrs) {
      this.linkUrl = attrs.href
      this.linkMenuIsActive = true
      this.$nextTick(() => {
        this.$refs.linkInput.focus()
      })
    },
    hideLinkMenu() {
      this.linkUrl = null
      this.linkMenuIsActive = false
    },
    setLinkUrl(command, url) {
      command({ href: url })
      this.hideLinkMenu()
    },
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

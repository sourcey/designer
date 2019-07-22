import { Node, Plugin } from 'tiptap';
import BlockEditor from '../utils/block-editor';
import { randomString } from '../../../../utils'
import { wrappingInputRule, toggleWrap } from 'tiptap-commands'
// import { toggleBlockType, setBlockType, textblockTypeInputRule } from 'tiptap-commands'

export default class Quote extends Node {
  get name() {
    return 'quote'
  }

  get schema() {
    return {
      attrs: {
        class: {
          default: null
        }
      },
      content: 'block*',
      group: 'block',
      // selectable: true,
      defining: true,
      draggable: true,
      parseDOM: [
        {
          tag: 'blockquote',
          getAttrs: dom => {
            console.log('SCANNING BLOCKQUOTE', dom, dom.getAttribute('class'))
            return ({
            class: dom.getAttribute('class')
          })}
        }
      ],
      toDOM: node => {
        return [ 'blockquote', { class: node.attrs.class }, 0 ]
      }
    }
  }

  commands({ type, schema }) {
    return () => {
      console.log('BLOCKQUOTE TOGGLE', type, schema.nodes.paragraph)
      return toggleWrap(type, schema.nodes.paragraph)
    }
  }

  inputRules({ type }) {
    return [
      wrappingInputRule(/^\s*>\s$/, type),
    ]
  }

  get view() {
    return {
      extends: BlockEditor,
      // data () {
      //   return {
      //     selected: true
      //   }
      // },
      methods: {
        // deselectNode (event) {
        //   this.selected = false
        // },
        toggleCite() {
          console.log(this.$parent.editor.commands.cite)
          this.$parent.editor.commands.cite()
        }
      },
      template: `
        <blockquote class="block-editor" :class="node.attrs.class">
          <div class="menubar" contenteditable="false">
            <button title="Regular" class="menubar__button" @click.prevent="updateClass(null, ['pull', 'left', 'right'])" :class="{ 'is-active': isRegular }"><icon name="widget-regular" size='12' /></button>
            <button title="Wide" class="menubar__button" @click.prevent="updateClass('pull', ['left', 'right'])" :class="{ 'is-active': isPull && !isLeft && !isRight }"><icon name="widget-wide" size='12' /></button>
            <button title="Float Left" class="menubar__button" @click.prevent="updateClass('left', ['right'])" :class="{ 'is-active': isLeft }"><icon name="widget-left" size='12' /></button>
            <button title="Float Right" class="menubar__button" @click.prevent="updateClass('right', ['left'])" :class="{ 'is-active': isRight }"><icon name="widget-right" size='12' /></button>
            <button title="Pull Out" class="menubar__button" @click.prevent="updateClass('pull')" :class="{ 'is-active': isPull && (isLeft || isRight) }"><icon name="widget-left-breakout" size='12' /></button>
            <button title="Cite" class="menubar__button" @click.prevent="$parent.editor.commands.cite" :class="{ 'is-active': $parent.editor.isActive.cite() }"><icon name="at" size='12' /></button>
            <button title="Delete" class="menubar__button" @click.prevent="deleteNode"><icon name="trash" size='12' /></button>
          </div>
          <div ref="content" :contenteditable="view.editable.toString()" :class="{ 'is-empty': contentEmpty }" data-empty-text="Enter quote..." />
        </blockquote>
      `
    }
  }
}

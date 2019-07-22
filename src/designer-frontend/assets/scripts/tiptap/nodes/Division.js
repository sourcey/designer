import { Node } from 'tiptap'
import { wrappingInputRule, toggleWrap } from 'tiptap-commands'

export default class Division extends Node {

  get name() {
    return 'div'
  }

  get schema() {
    return {
      attrs: {
        class: {
          default: null
        },
      },
      content: 'inline*',
      group: 'block',
      defining: true,
      draggable: false,
      parseDOM: [
        {
          tag: 'div',
          getAttrs: dom => ({
            class: dom.getAttribute('class')
          })
        }
      ],
      toDOM: node => ['div', { class: node.attrs.class }, 0],
    }
  }

  commands({ type, schema }) {
    return () => toggleWrap(type, schema.nodes.paragraph)
  }

  inputRules({ type }) {
    return [
      wrappingInputRule(/^\s*>\s$/, type),
    ]
  }

}

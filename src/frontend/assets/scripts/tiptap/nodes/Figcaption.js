import { Node } from 'tiptap'
import { wrappingInputRule, toggleWrap } from 'tiptap-commands'

export default class Figcaption extends Node {

  get name() {
    return 'figcaption'
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
          tag: 'figcaption',
          getAttrs: dom => ({
            class: dom.getAttribute('class')
          })
        }
      ],
      toDOM: node => ['figcaption', { class: node.attrs.class }, 0],
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

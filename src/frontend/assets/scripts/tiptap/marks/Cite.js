import { Mark } from 'tiptap'
import { toggleMark, markInputRule } from 'tiptap-commands'

import '../../../images/editor/at.svg?sprite=true'

export default class Cite extends Mark {

  get name() {
    return 'cite'
  }

  get schema() {
    return {
      parseDOM: [
        { tag: 'cite' },
      ],
      toDOM: () => ['cite', 0],
    }
  }

  keys({ type }) {
    return {
      'Mod-`': toggleMark(type),
    }
  }

  commands({ type }) {
    return () => toggleMark(type)
  }

  inputRules({ type }) {
    return [
      markInputRule(/(?:`)([^`]+)(?:`)$/, type),
    ]
  }

}

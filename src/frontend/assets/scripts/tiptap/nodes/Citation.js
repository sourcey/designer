import { Node } from 'tiptap'
import { setBlockType, textblockTypeInputRule, toggleBlockType } from 'tiptap-commands'

export default class Citation extends Node {

  get name() {
    return 'citation'
  }

  get schema() {
    return {
      content: 'inline*',
      group: 'block',
      defining: true,
      draggable: false,
      parseDOM: [
        { tag: 'cite' },
      ],
      toDOM: () => ['cite', 0]
    }
  }

  commands({ type, schema }) {
    return attrs => toggleBlockType(type, schema.nodes.paragraph, attrs)
  }

  // keys({ type }) {
  //   return this.options.levels.reduce((items, level) => ({
  //     ...items,
  //     ...{
  //       [`Shift-Ctrl-${level}`]: setBlockType(type, { level }),
  //     },
  //   }), {})
  // }

  // inputRules({ type }) {
  //   return this.options.levels.map(level => textblockTypeInputRule(
  //     new RegExp(`^(#{1,${level}})\\s$`),
  //     type,
  //     () => ({ level }),
  //   ))
  // }

}


// import { Node } from 'tiptap'
// import { setBlockType, textblockTypeInputRule, toggleBlockType } from 'tiptap-commands'
//
// export default class Heading extends Node {
//
//   get name() {
//     return 'citation'
//   }
//
//   get defaultOptions() {
//     return {
//       levels: [1],
//     }
//   }
//
//   get schema() {
//     return {
//       attrs: {
//         level: {
//           default: 1,
//         },
//         class: {
//           default: null
//         },
//       },
//       content: 'inline*',
//       group: 'block',
//       defining: true,
//       draggable: false,
//       parseDOM: this.options.levels
//         .map(level => ({
//           tag: `h${level}`,
//           getAttrs: dom => ({
//               level: level,
//               class: dom.getAttribute('class')
//           })
//         })),
//       toDOM: node => [`h${node.attrs.level}`, { class: node.attrs.class }, 0],
//     }
//   }
//
//   commands({ type, schema }) {
//     return attrs => toggleBlockType(type, schema.nodes.paragraph, attrs)
//   }
//
//   keys({ type }) {
//     return this.options.levels.reduce((items, level) => ({
//       ...items,
//       ...{
//         [`Shift-Ctrl-${level}`]: setBlockType(type, { level }),
//       },
//     }), {})
//   }
//
//   inputRules({ type }) {
//     return this.options.levels.map(level => textblockTypeInputRule(
//       new RegExp(`^(#{1,${level}})\\s$`),
//       type,
//       () => ({ level }),
//     ))
//   }
//
// }
//
//
//
// // import { Node } from 'tiptap'
// // import { wrappingInputRule, textblockTypeInputRule, toggleWrap } from 'tiptap-commands'
// //
// // export default class Citation extends Node {
// //
// //   get name() {
// //     return 'citation'
// //   }
// //
// //   get schema() {
// //     return {
// //       // content: 'inline*',
// //       // group: 'block',
// //
// //       // content: 'text*',
// //       content: 'inline*',
// //       group: 'block',
// //       defining: true,
// //       draggable: false,
// //       parseDOM: [
// //         { tag: 'h3' },
// //       ],
// //       toDOM: () => {
// //         console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! TO DOM')
// //
// //         return ['h3', 0]},
// //     }
// //   }
// //
// //   commands({ type, schema }) {
// //     console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! BLOCKQUOTE TOGGLE', type, schema.nodes.paragraph)
// //     return () => toggleWrap(type, schema.nodes.paragraph)
// //   }
// //
// //   inputRules({ type }) {
// //     return [3].map(level => textblockTypeInputRule(
// //       new RegExp(`^(#{1,${level}})\\s$`),
// //       type,
// //       () => ({ level }),
// //     ))
// //   }
// //
// //   // inputRules({ type }) {
// //   //   return [
// //   //     // wrappingInputRule(/^\s*>\s$/, type),
// //   //     textblockTypeInputRule(/^```$/, type),
// //   //   ]
// //   // }
// //
// // }

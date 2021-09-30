import { Node, Plugin } from 'tiptap'
import BlockEditor from '../utils/block-editor'
import { randomString } from '../../../../../base/utils'


function tryParseAttachment(attachment) {
  console.log('parsing attachment object', attachment)
  if (attachment && attachment[0] === '{')
    return JSON.parse(attachment)
  return {}
}

// https://codesandbox.io/s/5xrm89rmyx
export default class Figure extends Node {
  get name () {
    return 'figure'
  }

  get schema () {
    return {
      attrs: {
        src: {
          default: null
        },
        alt: {
          default: null
        },
        title: {
          default: null
        },
        class: {
          default: null
        },
        attachment: {
          default: null
        }
      },
      content: 'text*',
      group: 'block',
      defining: true,
      selectable: true,
      draggable: true,
      parseDOM: [
        {
          tag: 'figure',
          // contentElement: 'figcaption', // Helps the parser figure out where the child nodes are
          getAttrs: dom => ({
            src: dom.querySelector('img').getAttribute('src'),
            title: dom.querySelector('img').getAttribute('title'),
            alt: dom.querySelector('img').getAttribute('alt'),
            class: dom.getAttribute('class'),
            attachment: tryParseAttachment(dom.getAttribute('data-attachment'))
          })
        }
      ],
      toDOM: node => {
        return [ 'figure', {
            class: node.attrs.class,
            'data-attachment': JSON.stringify(node.attrs.attachment)
          },
          [ 'img', {
              src: node.attrs.src,
              alt: node.attrs.alt,
              title: node.attrs.title
            }
          ],
          [ 'figcaption', 0 ]
        ]
      }
    }
  }

  commands ({ type, schema }) {
    return {
      figure: attrs => (state, dispatch) => {
        const { selection } = state
        const position = selection.$cursor
          ? selection.$cursor.pos
          : selection.$to.pos
        const node = type.create(attrs)
        const transaction = state.tr.insert(position, node)
        dispatch(transaction)
      }
    }
  }

  get view () {
    return {
      extends: BlockEditor,
      data () {
        return {
          inputId: `figure-${randomString(5)}`,
          attachment: {}
        }
      },
      methods: {
        deleteAttachmentAndNode () {
          // FIXME: Delete attachment when outside node is removed
          // Ideally this node would not be deletable, but the solution seems
          // quite complex: https://discuss.prosemirror.net/t/how-to-prevent-node-deletion/130/6
          this.designerBackend.uploadAttachment(this.attachment)
          this.deleteNode()
        },
        filesChange (event) {
          if (!this.designerBackend) {
            alert('Designer backend not available')
            return
          }

          Array.from(event.target.files).forEach(file => {
            this.attachment = {
              file: file,
              metadata: this.designerBackend.fileMetadata()
            }
            this.designerBackend.uploadAttachment(this.attachment)
              .then(() => {
                this.attachment = this.designerBackend.serializeAttachment(this.attachment)
                this.updateAttrs({
                  src: this.attachmentUrl(this.attachment),
                  attachment: this.attachment
                })
              })
          })
        }
      },
      template: `
        <figure class="block-editor"
            :class="node.attrs.class"
            :data-class="node.attrs.class"
            :data-src="node.attrs.src"
            :data-title="node.attrs.title"
            :data-alt="node.attrs.alt"
            @click="selectNode">
          <div class="menubar" contenteditable="false">
            <button title="Regular" class="menubar__button" @click.prevent="updateClass(null, ['pull', 'left', 'right'])" :class="{ 'is-active': isRegular }"><icon name="editor-widget-regular" size='12' /></button>
            <button title="Wide" class="menubar__button" @click.prevent="updateClass('pull', ['left', 'right'])" :class="{ 'is-active': isPull && !isLeft && !isRight }"><icon name="editor-widget-wide" size='12' /></button>
            <button title="Float Left" class="menubar__button" @click.prevent="updateClass('left', ['right'])" :class="{ 'is-active': isLeft }"><icon name="editor-widget-left" size='12' /></button>
            <button title="Float Right" class="menubar__button" @click.prevent="updateClass('right', ['left'])" :class="{ 'is-active': isRight }"><icon name="editor-widget-right" size='12' /></button>
            <button title="Pull Out" class="menubar__button" @click.prevent="updateClass('pull')" :class="{ 'is-active': isPull && (isLeft || isRight) }"><icon name="editor-widget-left-breakout" size='12' /></button>
            <label title="Upload" class="menubar__button" :for="inputId"><icon name="editor-widget-replace" size='12' /></label>
            <button title="Delete" class="menubar__button" @click.prevent="deleteAttachmentAndNode"><icon name="trash" size='12' /></button>
          </div>
          <img v-if="node.attrs.src" :src="node.attrs.src" :title="node.attrs.title" :alt="node.attrs.alt" contenteditable="false" />
          <!-- <label v-else class="dropzone" title="Upload Image" :for="inputId" contenteditable="false">
            <placeholder mode="spacer" :aspect-ratio="2" />
          </label> -->
          <placeholder v-else mode="spacer" :aspect-ratio="2" />
          <input :id="inputId" type="file" accept="image/*" @change="filesChange" contenteditable="false" />
          <figcaption ref="content" :contenteditable="view.editable.toString()" :class="{ 'is-empty': contentEmpty }" data-empty-text="Enter caption..." />
        </figure>
      `
    };
  }

  // get plugins() {
  //   return [
  //     new Plugin({
  //       props: {
  //         handleDOMEvents: {
  //           drop(view, event) {
  //             const hasFiles =
  //               event.dataTransfer &&
  //               event.dataTransfer.files &&
  //               event.dataTransfer.files.length;
  //
  //             if (!hasFiles) {
  //               return;
  //             }
  //
  //             const images = Array.from(event.dataTransfer.files).filter(file =>
  //               /image/i.test(file.type)
  //             );
  //
  //             if (images.length === 0) {
  //               return;
  //             }
  //
  //             event.preventDefault();
  //
  //             const { schema } = view.state;
  //             const coordinates = view.posAtCoords({
  //               left: event.clientX,
  //               top: event.clientY
  //             });
  //
  //             images.forEach(image => {
  //               const reader = new FileReader();
  //
  //               reader.onload = readerEvent => {
  //                 const node = schema.nodes.image.create({
  //                   src: readerEvent.target.result
  //                 });
  //                 const transaction = view.state.tr.insert(
  //                   coordinates.pos,
  //                   node
  //                 );
  //                 view.dispatch(transaction);
  //               };
  //               reader.readAsDataURL(image);
  //             });
  //           }
  //         }
  //       }
  //     })
  //   ];
  // }
}

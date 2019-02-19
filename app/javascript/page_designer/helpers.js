import Editor from  './editor'

export default {
  install(Vue, options) {

    // Inject reusable component options
    Vue.mixin({
      methods: {
        getPageSpec(name) {
          return this.$root.spec.pages[name]
          // return Object.values(this.spec.pages).find(function(item) {
          //   return item.page == page
          // })
        },

        getSectionSpec(name) {
          return this.$root.spec.blocks[name]
          // return Object.values(this.spec.blocks).find(function(item) {
          //   return item.template == template
          // })
        },

        getBlockSpec(name) {
          return this.$root.spec.blocks[name]
          // return Object.values(this.spec.blocks).find(function(item) {
          //   return item.template == template
          // })
        },

        createBlockData(name, section) {
          const spec = this.getBlockSpec(name)
          return {
            id: name + '-' + this.randomString(10),
            name: name,
            template: spec.template,
            section: section,
            data: {}
          }
        },

        selectPreviewBlock(id) {
          var previewDOM = $(this.$root.$refs.preview).contents()
          console.log('selectFrameBlock', id, $(this.$root.$refs.preview), $(previewDOM))
          return $('body', previewDOM).css({'border': '100px solid'})
        },

        itemId(item) {
          if (!item.id) {
            item.id = (item.name || item.label || item.title) + '-' + this.randomString(10)
          }
          return item.id
        },

        openMarkdownEditor(textareaSelector) {
          let $textarea = $(textareaSelector)
          const $modal = $('#markdown-editor-modal')

          let editor = new Editor($modal.find('textarea')[0])
          editor.mde.value($textarea.val())
          $modal.modal('show')

          function updateEditorHeight() {
            $modal.find('.CodeMirror').height($modal.height())
          }
          updateEditorHeight()
          $(window).on('resize', updateEditorHeight)

          editor.mde.codemirror.on('change', function() {
            $textarea.val(editor.value())

            $textarea[0].dispatchEvent(new Event('input', { bubbles: true }));
            $textarea[0].dispatchEvent(new Event('change', { bubbles: true }));
          })

          $modal.on('hidden.bs.modal', function(e) {
            editor.destroy()
            $(window).off('resize', updateEditorHeight)
          })
        },

        copyToClipboard(text) {
          const dummy = document.createElement('input')
          document.body.appendChild(dummy)
          dummy.value = text
          dummy.select()
          document.execCommand('copy', false)
          dummy.remove()
          toastr.info("Copied!")
          console.log('copied', text)
        },

        getEmbedCode(itemId) {
          return '<%= page_designer_embed("' + itemId + '") %>'
        },

        // Generate a random alphanumeric string
        randomString(len) {
          const p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          return [...Array(len)].reduce(a=>a+p[~~(Math.random()*p.length)],'')
        }
      }
    })

    Vue.filter('formatSize', (size) => {
      if (size > 1024 * 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB'
      } else if (size > 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
      } else if (size > 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + ' MB'
      } else if (size > 1024) {
        return (size / 1024).toFixed(2) + ' KB'
      }
      return size.toString() + ' B'
    })

    Vue.filter('titleize', (str) => {
      return str.replace(/[A-Z]/g, ' $&').replace(/_/g, ' ').replace(/^./, str => str.toUpperCase())
    })
  }
}
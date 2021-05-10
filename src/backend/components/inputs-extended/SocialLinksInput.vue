<template lang="pug">
.designer-ui
  header.form-header(v-if='showHeader')
    .form-title Social Links
  draggable(v-model='value' :class='showHeader ? "border-bottom" : ""' @change='emitUpdate')
    .item-handle(
        v-for='(item, index) in value'
        :key='index')
      a.title(@click.prevent='editItem(item)') {{ object.url }}
      button.btn.btn-icon.btn-text-secondary(@click.prevent='value.splice(index, 1)')
        icon(name='trash' size='14')
      button.drag-handle.drag-menu-handle.btn.btn-icon.btn-text-secondary(@click.prevent)
        icon(name='move-v' size='14')
  a.item-handle.text-btn.text-success.py-075(v-if='!showHeader' @click.prevent='createItem' href='#')
    icon(name='plus' size='14')
    span Add link
  dialog-window(v-if='editingItem && editDialogOptions' :title='editDialogTitle' :options='editDialogOptions' @close='editDialogOptions = null')
    select-input(:object='editingItem' name='type' :spec='itemTypeSpec')
    text-input(:object='editingItem' name='url' :spec='itemUrlSpec')
    .dialog-footer(slot='footer')
      button.btn.dialog-btn.flex-fill(@click.prevent='editingItem = null') Cancel
      button.btn.dialog-btn.flex-fill(v-if='editingItemValid' @click.prevent='applyItem') OK
</template>

<script>
import DialogWindow from '../DialogWindow'
import SelectInput from '../inputs/SelectInput'
import TextInput from '../inputs/TextInput'
import Input from '../../mixins/input'
import IpcServer from '../../ipc-server'
import Draggable from 'vuedraggable'

export default {
  extends: Input,
  props: {
    showHeader: {
      type: Boolean,
      default: true
    }
  },
  components: {
    DialogWindow,
    SelectInput,
    TextInput,
    Draggable
  },
  data() {
    return {
      editDialogOptions: null,
      editingItem: null
    }
  },
  computed: {
    editingItemValid () {
      return this.editingItem
        && this.editingItem.type
        && this.editingItem.url
    },
    editDialogTitle () {
      if (this.editingItem && this.editingItem.unsaved)
        return 'New Link'
      else
        return 'Edit Link'
    },
    itemTypeSpec () {
      return {
        label: 'Link type',
        placeholder: 'Select link type...',
        options: {
          facebook: 'Facebook',
          twitter: 'Twitter',
          instagram: 'Instagram',
          pinterest: 'Pinterest',
          tumblr: 'Tumblr',
          website: 'Website URL'
        },
        required: true
      }
    },
    itemUrlSpec () {
      return {
        label: 'URL',
        placeholder: 'https:// ...',
        required: true
      }
    }
  },
  mounted () {
  },
  methods: {
    showItemDialog () {
      const rect = this.$el.getBoundingClientRect()
      const childRect = this.$el.firstElementChild.firstElementChild.getBoundingClientRect()

      this.editDialogOptions = {
        draggable: false,
        x: childRect.left - rect.left,
        y: rect.top,
        width: childRect.width,
        bodyClass: 'py-05',
        overlayStyle: {
          left: rect.left + 'px',
          width: rect.width + 'px'
        }
      }
    },
    applyItem () {
      if (this.editingItem.unsaved) {
        delete this.editingItem.unsaved
        this.value.push(this.editingItem)
      }
      this.editingItem = null
      this.emitUpdate()
    },
    createItem () {
      console.log('social links form: create menu item')
      this.editingItem = {
        type: null,
        url: null,
        unsaved: true
      }
      this.showItemDialog()
    },
    removeItem (index) {
      console.log('social links form: remove menu item', index)
      this.value.splice(index, index)
    },
    editItem (item) {
      console.log('social links form: edit menu item', item)
      this.editingItem = item
    },

    // onSelect (name) {
    //   console.log('social links form: on select', name)
    //   // if (this.value.elements || this.value.layouts) {
    //   //   return // drop menu property events
    //   // }
    //
    //   IpcServer.selectElementProperty(this.value, this.spec, name)
    // },
    emitUpdate () {
      console.log('social links form: on update', this.name, this.value)

      this.$emit('update', this.name, this.value)
      this.$forceUpdate()

      IpcServer.postPreviewMessage('updateResourceProperty', {
        name: this.name,
        value: this.value
      })

      // IpcServer.postPreviewMessage('updatePageProperty', {
      //   // menuId: this.value.id,
      //   name: name,
      //   menu: menu
      // })
    },
  }
}
</script>

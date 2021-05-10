<template lang="pug">
.designer-ui
  //- div {{ item }}
  //- div {{ spec }}
  //- div {{ menu }}
  header.form-header(v-if='showHeader')
    .form-title {{ value.label || spec.label }}
    .actions
      button.btn.btn-icon(@click.prevent='createItem')
        icon(name='plus' size='14')
  draggable(v-model='value.items' :class='showHeader ? "border-bottom" : ""' @change='emitUpdate')
    //- element='section'.border-bottom
    .item-handle(
        v-for='(item, index) in value.items'
        :key='index')
      a.title(@click.prevent='editItem(item)' href='#' title='Edit menu item') {{ item.label }}
      .actions
        button.btn.btn-icon.btn-text-secondary(@click.prevent='removeItem(index)')
          icon(name='trash' size='14')
        button.drag-handle.drag-menu-handle.btn.btn-icon.btn-text-secondary(@click.prevent)
          icon(name='move-v' size='14')
  a.item-handle.text-btn.text-success.py-075(v-if='!showHeader' @click.prevent='createItem' href='#')
    .label Add item
    .btn.btn-icon
      icon(name='plus' size='14')
  dialog-window(v-if='dialogOptions && editingItem' title='Edit Menu Item' :options='dialogOptions' @close='dialogOptions = null')
    select-input(:object='editingItem' name='type' :spec='itemTypeSpec')
    select-input(v-if='editingItem.type === "page"' :object='editingItem' name='reference' :spec='itemPageSelectSpec')
    text-input(v-if='editingItem.type' :object='editingItem' name='label' :spec='{ label: "Label" }')
    text-input(v-if='editingItem.type === "url"' :object='editingItem' name='url' :spec='{ label: "URL" }')
    .dialog-footer(slot='footer')
      button.btn.dialog-btn.flex-fill(@click.prevent='editingItem = null') Cancel
      button.btn.dialog-btn.flex-fill(v-if='editingItemValid' @click.prevent='apply') Apply
</template>

<script>
import DialogWindow from '../DialogWindow'
import SelectInput from '../inputs/SelectInput'
import TextInput from '../inputs/TextInput'
// import Spinner from '../Spinner'
import Input from '../../mixins/input'
import IpcServer from '../../ipc-server'
// import { clone } from 'designer/app/javascript/base/utils'
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
    // Spinner,
    Draggable
  },
  data() {
    return {
      dialogOptions: null,
      editingItem: null
    }
  },
  computed: {
    editingItemValid () {
      return this.editingItem
        && this.editingItem.type
        && this.editingItem.label
        && (this.editingItem.url || this.editingItem.reference)
    },
    itemTypeSpec () {
      return {
        label: 'Link type',
        options: {
          page: 'Page',
          url: 'External Link'
        },
        default: 'page',
        required: true
      }
    },
    itemPageSelectSpec () {
      const options = {}
      this.designerPreviewStore.state.site.pages.forEach(x => {
        if (!this.designerBackendState.spec.pages[x.name].dynamic && x.data.title)
          options[x.reference] = x.data.title
      })

      return {
        label: 'Page',
        options: options,
        required: true
      }
    }
  },
  methods: {
    showItemDialog () {
      const rect = this.$el.getBoundingClientRect()
      const childRect = this.$el.firstElementChild.firstElementChild.getBoundingClientRect()

      this.dialogOptions = {
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
    apply () {
      if (this.editingItem.unsaved) {
        delete this.editingItem.unsaved
        this.value.items.push(this.editingItem)
      }
      this.editingItem = null
      this.emitUpdate()
    },
    createItem () {
      console.log('menu form: create menu item')
      this.editingItem = {
        type: null,
        label: null,
        reference: null,
        url: null,
        unsaved: true
      }
      this.showItemDialog()
    },
    removeItem (index) {
      console.log('menu form: remove menu item', index)
      this.value.items.splice(index, index)
    },
    editItem (item) {
      console.log('menu form: edit menu item', item)
      this.editingItem = item
    },

    // onSelect (name) {
    //   console.log('menu form: on select', name)
    //   // if (this.value.elements || this.value.layouts) {
    //   //   return // drop menu property events
    //   // }
    //
    //   IpcServer.selectElementProperty(this.menu, this.spec, name)
    // },
    emitUpdate () {
      console.log('menu form: on update', this.name, this.menu)

      this.$emit('update', this.name, this.menu)
      this.$forceUpdate()

      IpcServer.postPreviewMessage('updateResourceProperty', {
        name: this.name,
        value: this.value,
        member: 'menus'
      })

      // IpcServer.postPreviewMessage('updatePageProperty', {
      //   // menuId: this.value.id,
      //   name: name,
      //   menu: menu
      // })
    }
  }
}
</script>

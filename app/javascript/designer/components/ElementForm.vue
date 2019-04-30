<template lang="pug">
//- div
//-   div {{ JSON.stringify(item) }}
//-   div ----------------------------------
//-   div {{ JSON.stringify(item) }}
form(:id='itemId(item)' :class="['block-form', 'collapsible', {'expand': showForm}]" @dragstart='onDragElement')
  .section-header
    span.collapse-caret
      i.fas.fa-caret-right
    a.title(@click.prevent='showForm = !showForm' href='#') {{ item.title || spec.label }}
    button.drag-handle.drag-block-handle.btn.btn-icon.btn-text-secondary(@click.prevent)
      i.fas.fa-arrows-alt
    b-dropdown(variant='icon btn-text-secondary' size='sm' no-caret)
      template(slot='button-content')
        i.fas.fa-ellipsis-v
      b-dropdown-item(v-if='designerState.enableElementEmbeds' href='#' @click='copyToClipboard(getEmbedCode(item.id))') Copy embed code
      b-dropdown-item(v-if='designerState.enableElementEmbeds' href='#' @click='item.hidden = !item.hidden') Toggle embedded: ({{ item.hidden }})
      b-dropdown-item.text-danger(v-if='deletable' href='#' @click.prevent="deleteElement") Delete
  form-section.element-items.collapse-content(:spec='spec' :item='item' :root='root')
</template>

<script>
import FormSection from './FormSection.vue'

export default {
  props: ['item', 'spec', 'root', 'expanded'],
  components: {
    FormSection
  },
  data() {
    return {
      showForm: this.expanded, // || false
      // itemData: this.item && this.item.data ? this.item.data : {}
    }
  },
  created() {
    // console.log('ElementForm', this, this.item, this.spec)
  },
  computed: {
    deletable () {
      return this.item.deletable !== false && this.spec.deletable !== false
    }
  },
  methods: {
    onDragElement(event) {
      console.log('onDragElement', event, this)
      event.dataTransfer.setData('id', this.item.id)
      event.dataTransfer.setData('embed', this.getEmbedCode(this.item.id))
    },
    deleteElement () {
      if (confirm("Are you sure?")) {
        this.$emit('remove')
      }
    }
    // onSelect(name) {
    //   console.log('ElementForm onSelect', name)
    //
    //   // Select the current element on the preview
    //   if (this.item.id && name) {
    //     this.postPreviewMessage('selectProperty', {
    //       id: this.item.id,
    //       name: name
    //     })
    //   }
    // },
    // onUpdate(name, value) {
    //   console.log('ElementForm onUpdate', name, value, this.spec[name].actions)
    //
    //   // Update the property in the preview
    //   if (this.item.id && name) {
    //     this.postPreviewMessage('updateProperty', {
    //       id: this.item.id,
    //       name: name,
    //       value: value
    //     })
    //   }
    // }
  }
}
</script>

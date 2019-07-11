<template lang="pug">
//- div
//-   div {{ JSON.stringify(item) }}
//-   div ----------------------------------
//-   div {{ JSON.stringify(item) }}:id='itemId(item)'
form(:class="['block-form', 'collapsible', {'expand': showForm}]" @dragstart='onDragElement')
  .item-handle
    //- span.collapse-caret
      i.fas.fa-caret-right
    a.label(@click.prevent='showForm = !showForm' href='#') {{ object.title || spec.label }}
    button.drag-handle.drag-block-handle.btn.btn-icon.btn-text-secondary(@click.prevent)
      icon(name='move-v')
    b-dropdown(variant='icon btn-text-secondary' size='sm' no-caret)
      template(slot='button-content')
        icon(name='ellipsis-v')
      b-dropdown-item(v-if='designerBackendState.enableElementEmbeds' href='#' @click='copyToClipboard(getEmbedCode(object.id))') Copy embed code
      b-dropdown-item(v-if='designerBackendState.enableElementEmbeds' href='#' @click='object.hidden = !object.hidden') Toggle embedded: ({{ object.hidden }})
      b-dropdown-item.text-danger(v-if='deletable' href='#' @click.prevent="deleteElement") Delete
  form-section.element-items.collapse-content(:spec='spec' :object='object' :root='root')
</template>

<script>
import FormSection from './FormSection.vue'

export default {
  props: ['object', 'spec', 'root', 'expanded'],
  components: {
    FormSection
  },
  data () {
    return {
      showForm: this.expanded, // || false
      // itemData: this.model && this.object.data ? this.object.data : {}
    }
  },
  created () {
    // console.log('ElementForm', this, this.model, this.spec)
  },
  computed: {
    deletable () {
      return this.object.deletable !== false && this.spec.deletable !== false
    }
  },
  methods: {
    onDragElement(event) {
      console.log('onDragElement', event, this)
      event.dataTransfer.setData('id', this.object.id)
      event.dataTransfer.setData('embed', this.getEmbedCode(this.object.id))
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
    //   if (this.object.id && name) {
    //     this.postPreviewMessage('selectProperty', {
    //       id: this.object.id,
    //       name: name
    //     })
    //   }
    // },
    // onUpdate(name, value) {
    //   console.log('ElementForm onUpdate', name, value, this.spec[name].actions)
    //
    //   // Update the property in the preview
    //   if (this.object.id && name) {
    //     this.postPreviewMessage('updateProperty', {
    //       id: this.object.id,
    //       name: name,
    //       value: value
    //     })
    //   }
    // }
  }
}
</script>

<template lang="pug">
div
  header.form-header
    .form-title Elements
    .actions
      button.btn.btn-icon(@click.prevent='createElement')
        icon(name='plus' size='14')
  draggable.border-bottom-0(
      element='section'
      v-model='resource.content'
      :options="{handle:'.drag-element-handle'}")
    //- @change='onReorderElements'
    element-form(
        v-if='$store.getters.getElementSpec(element.name)'
        v-for='(element, index) in resource.content'
        :key='element.id'
        :object='element'
        :root='resource.content'
        :spec='$store.getters.getElementSpec(element.name)'
        :expanded='index === 0'
        @remove='removeElement(element)')
</template>

<script>
import ElementForm from './ElementForm'
import Draggable from 'vuedraggable'


export default {
  components: {
    ElementForm,
    Draggable
  },
  props: {
    resource: {
      type: Object,
      required: true
    },
  },
  methods: {
    createElement (event) {
      // console.log('designer loaded', this.designerBackendStore)
      // console.log('designer designerBackendInterface loaded', this.designerBackendInterface)

      this.$store.getters.designerBackendInterface.createElementDialog(event, this.resource)
    },
    removeElement (element) {
      this.$store.getters.designerBackendInterface.removeResourceElement(this.resource, element)
    },
  }
}
</script>

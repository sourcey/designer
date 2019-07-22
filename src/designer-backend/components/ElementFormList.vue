<template lang="pug">
div
  header.form-header
    .form-title Elements
    .actions
      button.btn.btn-icon(@click.prevent='createElement')
        icon(name='plus')
  draggable.border-bottom-0(
      element='section'
      v-model='designerBackendState.content'
      :options="{handle:'.drag-element-handle'}")
    //- @change='onReorderElements'
    element-form(
        v-for='(element, index) in designerBackendState.content'
        :key='element.id'
        :object='element'
        :root='designerBackendState.content'
        :spec='$store.getters.getElementSpec(element.name)'
        :expanded='index === 0'
        @remove='removeElement(element)')
</template>

<script>
// import Vue from 'vue'
// import PreviewWindow from './components/PreviewWindow'
// import MediaGallery from './components/MediaGallery'
// import ResourceForm from './components/ResourceForm'
import ElementForm from './ElementForm'
import Draggable from 'vuedraggable'
// import { randomString } from '../designer/utils'
//
// import './icons'
// import './plugins/filters'
// import './plugins/bootstrap'
// import Globals from './mixins/globals'
// import EditorInterface from './mixins/editor-interface'
//
// Vue.mixin(Globals)
// Vue.mixin(Globals)


export default {
  components: {
    // PreviewWindow,
    // ResourceForm,
    ElementForm,
    Draggable,
    // MediaGallery
  },
  // mixins: [
  //   EditorInterface
  // ],
  // beforeMount () {
  //   console.log('designer loaded', this.designerBackendState)
  // },
  // methods: {
  //   save () {
  //     this.$store.dispatch('saveResource')
  //     // this.$store.saveResource(this)
  //   }
  // }
}
</script>

<style lang="scss">
// @import '@/assets/styles/frontend/_variables.scss';scoped
// @import './assets/styles/designer-vendor.scss';
// @import './assets/styles/designer.scss';
</style>

<template lang="pug">
div
  header.form-header
    .form-title Sections
    .actions
      button.btn.btn-icon(@click.prevent='createSection')
        icon(name='plus' size='14')
  //- Reset the form on change event to handle bugged iframe reactivity.
  draggable.border-bottom(
      v-if='resource.content.length > 0'
      :options="{handle:'.drag-resource-handle'}"
      element='section'
      v-model='resource.content'
      @change='markUnsaved')
    .item-handle(
        v-for='(section, index) in resource.content'
        :key='index')
      .title {{ section.data && section.data.label ? section.data.label : section.label }}
      .actions
        button.btn.btn-icon.btn-text-secondary(v-if='section.main !== true && section.deletable !== false' @click.prevent='removeSection(section.id)')
          icon(name='trash' size='14')
        button.drag-handle.drag-resource-handle.btn.btn-icon.btn-text-secondary(v-if='resource.content.length > 1' @click.prevent)
          icon(name='move-v' size='14')
  .no-data(v-else)
    | No sections.&nbsp;
    a(@click.prevent='createSection' href='#') Add
</template>

<script>
import FormSection from './FormSection.vue'
import Draggable from 'vuedraggable'
// import IpcServer from '../ipc-server'
// import { clone, resetObject } from '../../base/utils'

export default {
  name: 'section-form-list',
  components: {
    FormSection,
    Draggable
  },
  props: {
    resource: {
      type: Object,
      required: true
    },
  },
  // data () {
  //   return {
  //     renderForm: true
  //   }
  // },
  computed: {
    // resource () {
    //   // NOTE: We are not cloning the resource object like we do for sections and
    //   // elements. Perhaps we should?
    //   return this.designerPreviewStore.getters.resource(this.$route.params.reference)
    // },
    // spec () {
    //   return this.designerBackendStore.getters.getSectionSpec(this.resource.name)
    // },
    // designerComponent () {
    //   return this.parentComponent('designer')
    // },
  },
  // mounted () {
  //   console.log('resource form: mounted', this.resource.data)
  //   this.resourceCloned = clone(this.resource)
  //   this.navigateToPage()
  // },
  // beforeDestroy () {
  //   this.navigateHome()
  // },
  methods: {
    // save () {
    //   this.$store.getters.designerBackendInterface.savePage(this.resource)
    // },
    // cancel () {
    //   resetObject(this.resource, this.resourceCloned)
    // },
    // navigateHome () {
    //   console.log('resource form: navigate home')
    //   // this.$store.getters.designerBackendInterface.editingPageReference = null
    //   this.$store.getters.designerBackendInterface.navigateToPage('/')
    // },
    // navigateToPage () {
    //   console.log('resource form: navigate to resource', this.resource)
    //   if (this.resource) {
    //     // this.$store.getters.designerBackendInterface.editingPageReference = this.resource.reference
    //     this.$store.getters.designerBackendInterface.navigateToPage(this.resource.path)
    //   }
    // },
    emitUpdate (name, value) {
      console.log('section form list: on update', name, value)
      this.$store.getters.designerBackendInterface.markUnsaved()

      // IpcServer.postPreviewMessage('updatePageProperty', {
      //   name: name,
      //   value: value
      // })
    },
    // resetForm () {
    //   this.renderForm = false
    //   this.$nextTick(() => this.renderForm = true)
    // },
    markUnsaved () {
      this.$store.getters.designerBackendInterface.markUnsaved()
    },
    createSection (event) {
      console.log(this.$store.getters.designerBackendInterface)
      this.$store.getters.designerBackendInterface.createPageSectionDialog(event, this.resource)
      // .then(() => {
      //   this.markUnsaved() // update after preview store is updated
      // })
      // this.resetForm()
    },
    removeSection (id) {
      this.$store.getters.designerBackendInterface.removePageSection(this.resource, id)
      // this.markUnsaved() // update after preview store is updated
      // this.resetForm()
    },
  },
  // watch: {
  //   'resource.data.path': function (newVal, oldVal) {
  //     // console.log('UPDATE PATH', this.$store.getters.designerBackendInterface.$parent)
  //     // this.designerBackendStore.mergeSpecDefaults(this.section, this.layoutSpec)
  //     this.$store.getters.designerBackendInterface.previewApp.$store.commit('updatePagePath', this.resource)
  //   }
  // },
  // watch: {
  //   '$route.params.reference': function (reference) {
  //     // NOTE: forceUpdate is not sufficient as resource title text input does not
  //     // update when switching between resources.
  //     // this.$forceUpdate()
  //
  //     this.resetForm()
  //   }
  // }
}
</script>


<style lang="scss">
// @import '@/assets/styles/frontend/_variables.scss';scoped
// @import './assets/styles/designer-vendor.scss';
// @import './assets/styles/designer.scss';
</style>

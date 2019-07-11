<template lang="pug">
section.form-section
  slot(name='start')
  dynamic-input(v-for='(property, name) in spec.properties',
      v-if='!property.hidden',
      :key='name',
      :name='name',
      :object='itemData',
      :spec='property',
      :parent='object',
      :root='root',
      v-on='$listeners')
      //- @select='onSelect',
      //- @update='onUpdate'
  slot(name='end')
</template>

<script>
import DynamicInput from './DynamicInput.vue'
// import Hooks from  '../actions'
// import Hooks from  '../hooks'
// import IpcServer from '../ipc-server'

export default {
  props: ['object', 'spec', 'root'], //, 'parent'
  components: {
    DynamicInput
  },
  data () {
    return {
      // :object="property.member ? model[property.member] : model"
      // itemData: this.object.data
      itemData: this.object && this.object.data ?
        this.object.data :
        this.$set(this.object, 'data', {}) // make it reactive
    }
  },
  mounted () {
    // console.log('form section: mounted', this, this.model, this.spec)

    // Set the item ID if not already set.
    // This is a fallback for when this component is used outside of the designer.
    // this.modelId(this.model) // Do not do this, pages can have no ID
  },
  // created() {
  //   console.log('form section: created', this, this.model, this.spec)
  // },
  // methods: {
  //   onSelect(name) {
  //     console.log('form section: on select', name)
  //     if (this.object.elements || this.object.layouts) {
  //       return // drop page property events
  //     }
  //
  //     IpcServer.selectElementProperty(this.model, this.spec, name)
  //   },
  //   onUpdate(name, value) {
  //     console.log('form section: on update', name, value)
  //     this.designerBackendState.unsaved = true
  //     IpcServer.updateElementProperty(this.model, this.spec, name, value)
  //   }
  // }
}
</script>

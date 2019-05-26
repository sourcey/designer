<template lang="pug">
section
  slot(name='start')
  dynamic-input(v-for='(property, name) in spec.properties',
      v-if='!property.hidden',
      :key='property.name',
      :name='name',
      :item='itemData',
      :spec='property',
      :parent='item',
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
  props: ['item', 'spec', 'root'], //, 'parent'
  components: {
    DynamicInput
  },
  data() {
    return {
      // :item="property.member ? model[property.member] : model"
      // itemData: this.item.data
      itemData: this.item && this.item.data ?
        this.item.data :
        this.$set(this.item, 'data', {}) // make it reactive
    }
  },
  mounted() {
    console.log('form section: mounted', this, this.item, this.spec)

    // Set the item ID if not already set.
    // This is a fallback for when this component is used outside of the designer.
    // this.itemId(this.item) // Do not do this, pages can have no ID
  },
  // created() {
  //   console.log('form section: created', this, this.item, this.spec)
  // },
  // methods: {
  //   onSelect(name) {
  //     console.log('form section: on select', name)
  //     if (this.item.elements || this.item.layouts) {
  //       return // drop page property events
  //     }
  //
  //     IpcServer.selectElementProperty(this.item, this.spec, name)
  //   },
  //   onUpdate(name, value) {
  //     console.log('form section: on update', name, value)
  //     this.designerState.unsaved = true
  //     IpcServer.updateElementProperty(this.item, this.spec, name, value)
  //   }
  // }
}
</script>

<template lang="pug">
  form
    div(v-for='(section, sectionName) in spec.layouts', :key='sectionName')
      //
        <br>section: -------------------------
        <br>{{section}}
      header
        h2 {{ section.label }}
      //
        <FormSection
        :item="item"
        :spec="section" />
      // name, propertyData(property)[name]
      section
        //- div {{ model }}
        dynamic-input(v-for='(property, name) in section.properties'
            :key='name'
            :name='name'
            :item='propertyData(property)'
            :spec='property'
            @update='onUpdate(sectionName, ...arguments)')
</template>

<script>
import Vue from 'vue'
import DynamicInput from './DynamicInput.vue'
import IpcServer from '../ipc-server'

export default {
  props: ['resource', 'spec'],
  components: {
    DynamicInput
  },
  data() {
    return {
      showForm: false,
      // resourceElements: this.resource && this.resource.elements ? this.resource.elements : [],
      // resourceData: this.resource && this.resource.data ? this.resource.data : {},
      // sectionElements: {}
    }
  },
  created() {
    console.log('resource form', this, this.resource, this.spec)
  },
  computed: {
    model () {
      return this.resource //this.$deepModel(this.resource)
    }
  },
  methods: {
    propertyData(property) {
      return property.member ? this.model[property.member] : this.model
    },
    onUpdate(sectionName, name, value) {
      const spec = this.spec.layouts[sectionName] //.properties
      console.log('resource form: on update', this.model, spec, name, value)
      this.designerState.unsaved = true
      IpcServer.updateResourceProperty(this.model, spec, name, value)
    }
  }
}
</script>

<!-- <style>
</style> -->

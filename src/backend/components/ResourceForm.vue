<template lang="pug">
  form
    div(v-for='(section, sectionName) in spec.sections' :key='sectionName')
      header.form-header(v-if='section.label')
        .form-title {{ section.label }}
      section.form-section
        dynamic-input(v-for='(property, name) in section.properties'
            :key='name'
            :name='name'
            v-model='propertyData(property)[name]'
            :object='propertyData(property)'
            :spec='property'
            @update='emitUpdate(sectionName, ...arguments)')
</template>

<script>
import Vue from 'vue'
import DynamicInput from './DynamicInput.vue'
import IpcServer from '../ipc-server'
// import { clone, mergeObject } from '../../base/utils'


export default {
  props: ['resource', 'spec'],
  components: {
    DynamicInput
  },
  mounted () {
    // this.initialValues = clone(this.formValues())
  },
  methods: {

    // Get resource values present in the form spec
    formValues (resource, formName) {
      const data = {}
      Object.keys(this.spec.sections).forEach(sectionName => {
        const section = this.spec.sections[sectionName]
        for (let name in section.properties) {
          const prop = section.properties[name]
          if (prop.member) {
            if (!data[prop.member])
              data[prop.member] = {}
            data[prop.member][name] = this.resource[prop.member][name]
          } else {
            data[name] = this.resource[name]
          }
        }
      })
      return data
    },
    propertyData (property) {
      return property.member ? this.resource[property.member] : this.resource
    },
    emitUpdate (sectionName, name, value) {
      const spec = this.spec.sections[sectionName].properties[name] //.properties
      // console.log('resource form: on update', this.resource, spec, name, value)
      this.designerBackendState.unsaved = true
      IpcServer.updateResourceProperty(this.resource, name, value, spec)
      this.$emit('update', name, value, spec)
    },
    resetInitialValues () {
      this.callInputs('setInitialValue')
    },
    restoreDefaultValues () {
      this.callInputs('setDefaultValue')
    },
    saveValues () {
      this.callInputs('saveValue')
    },
    callInputs (method) {
      this.$children.forEach(x => {
        if (x.$options.name === 'dynamic-input') {
          if (x.$children[0][method]) {
            x.$children[0][method]()
          }
        }
        else if (x[method]) {
          x[method]()
        }
      })
    },
  }
}
</script>

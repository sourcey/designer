<template lang="pug">
  component(:is='loadComponent'
    v-model='object[name]'
    :name='name'
    :spec='spec'
    v-show='visible'
    v-on='$listeners'
    @input='onInput')
  //- :object='object'
  //- :parent='parent'
  //- :root='root'
</template>

<script>
export default {
  name: 'dynamic-input',
  props: ['spec', 'name', 'object', 'parent', 'root'],
  computed: {
    onInput (value) {
      // Emit the update event
      this.$emit('update', this.name, this.object[this.name])
    },
    visible () {
      if (this.spec.hidden)
        return false
      if (this.spec.if) {
        // match value exists
        if (typeof(this.spec.if) === 'string') {
          // console.log('dynamic input: visible: if exists', this.spec.if, this.object[this.spec.if])
          return !!this.object[this.spec.if]
        }

        const key = Object.keys(this.spec.if)[0]
        const val = this.spec.if[key]

        // match exact value
        if (typeof(val) === 'string') {
          // console.log('dynamic input: visible: if matches', val, this.object[key])
          return this.object[key] === val
        }

        else if (Array.isArray(val)) {
          // console.log('dynamic input: visible: if contains', val, this.object[key])
          return this.object[key] && val.includes(this.object[key])
        }

        // console.log('dynamic input: visible: no match')
        return false
      }
      if (this.spec.unless)
        return !this.object[this.spec.unless]
      return true
    },
    componentName () {
      if (this.spec.type === 'array' && this.spec.properties)
        return 'SortableArrayInput'
      else if (this.spec.input === 'tags') //this.spec.type === 'array'
        return 'TagsInput'
      else if (this.spec.input === 'select')
        return 'SelectInput'
      else if (this.spec.input === 'select-list')
        return 'SelectListInput'
      else if (this.spec.options)
        return 'DropdownInput'
      // else if (this.spec.type === 'attachment' && this.spec.input === 'blob')
      //   return 'AttachmentBlobInput'
      else if (this.spec.type === 'attachment' && this.spec.array)
        return 'AttachmentArrayInput'
      else if (this.spec.type === 'attachment')
        return 'AttachmentInput'
      else if (this.spec.type === 'color')
        return 'ColorInput'
      else if (this.spec.type === 'boolean')
        if (this.spec.type === 'checkbox')
          return 'CheckboxInput'
        else
          return 'SwitchInput'
      else if (this.spec.type === 'font')
        return 'FontInput'
      else if (this.spec.input === 'range')
        return 'RangeSliderInput'
      else if (this.spec.type === 'string' && this.spec.input === 'textarea')
        return 'TextareaInput'
      else
        return 'TextInput'
    },
    loadComponent() {
      if (this.designerBackendStore && this.designerBackendStore.loadInputComponent) {
        const component = this.designerBackendStore.loadInputComponent(this.spec)
        if (component)
          return component
      }
      // const component = this.designerBackendStore.loadInputComponent(this.spec.input)
      // if (component)
      //   return () => import(`./inputs/${this.componentName}.vue`)
        // return component
      return () => import(`./inputs/${this.componentName}.vue`)
    }
  }
}
</script>

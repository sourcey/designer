<template lang="pug">
  component(:is='loadComponent'
    :name='name'
    :item='item'
    :spec='spec'
    :parent='parent'
    :root='root'
    v-show='visible'
    v-on='$listeners')
</template>

<script>
export default {
  name: 'dynamic-input',
  props: ['spec', 'name', 'item', 'parent', 'root'],
  computed: {
    visible () {
      if (this.spec.hidden)
        return false
      if (this.spec.if) {
        // match value exists
        if (typeof(this.spec.if) === 'string') {
          // console.log('dynamic input: visible: if exists', this.spec.if, this.item[this.spec.if])
          return !!this.item[this.spec.if]
        }

        const key = Object.keys(this.spec.if)[0]
        const val = this.spec.if[key]

        // match exact value
        if (typeof(val) === 'string') {
          // console.log('dynamic input: visible: if matches', val, this.item[key])
          return this.item[key] === val
        }

        else if (Array.isArray(val)) {
          // console.log('dynamic input: visible: if contains', val, this.item[key])
          return this.item[key] && val.includes(this.item[key])
        }

        // console.log('dynamic input: visible: no match')
        return false
      }
      if (this.spec.unless)
        return !this.item[this.spec.unless]
      return true
    },
    componentName () {
      if (this.spec.type === 'array' && this.spec.properties)
        return 'SortableArrayInput'
      else if (this.spec.type === 'array')
        return 'TagsInput'
      else if (this.spec.options)
        return 'SelectInput'
      else if (this.spec.type === 'attachment' && this.spec.input === 'blob')
        return 'AttachmentBlobInput'
      else if (this.spec.type === 'attachment')
        return 'AttachmentInput'
      else if (this.spec.type === 'attachment_array')
        return 'AttachmentArrayInput'
      else if (this.spec.type === 'color')
        return 'ColorInput'
      else if (this.spec.type === 'boolean')
        return 'CheckboxInput'
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
      const component = this.designerStore.loadInputComponent(this.spec)
      if (component)
        return component
      return () => import(`./inputs/${this.componentName}.vue`)
    }
  }
}
</script>

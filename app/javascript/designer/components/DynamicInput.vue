<template lang="pug">
  component(:is='loadComponent'
    :name='name'
    :item='item'
    :spec='spec'
    :parent='parent'
    :root='root'
    v-on='$listeners')
</template>

<script>
export default {
  props: ['spec', 'name', 'item', 'parent', 'root'],
  computed: {
    componentName () {
      if (this.spec.type === 'array' && this.spec.properties)
        return 'SortableArrayInput'
      else if (this.spec.type === 'array')
        return 'TagsInput'
      else if (this.spec.type === 'attachment')
        return 'AttachmentInput'
      else if (this.spec.type === 'attachment_array')
        return 'AttachmentArrayInput'
      else if (this.spec.type === 'attachment_blob')
        return 'AttachmentBlobInput'
      else if (this.spec.type === 'color')
        return 'ColorInput'
      else if (this.spec.type === 'boolean')
        return 'CheckboxInput'
      else if (this.spec.type === 'font')
        return 'FontInput'
      else if (this.spec.enum)
        return 'SelectInput'
      else if (this.spec.input === 'range')
        return 'RangeSliderInput'
      else if (this.spec.type === 'string' && this.spec.multiline)
        return 'TextareaInput'
      // else if (this.spec.type === 'string')
      //   return 'TextInput'
      // else if (this.spec.type === 'string' && this.spec.editor === 'trix')
      //   return 'TrixTextInput'
      // else if (this.spec.type === 'string' && this.spec.editor === 'markdown')
      //   return 'MarkdownTextInput'
      else
        return 'TextInput'
    },
    loadComponent() {
      return () => import(`./inputs/${this.componentName}.vue`)
    }
  },
  // created () {
  //   console.log('dynamic input: created', this.$listeners)
  // },
  // methods: {
  //   onSelect(name) {
  //     console.log('dynamic input: on select', name)
  //   },
  //   onUpdate(name, value) {
  //     console.log('dynamic input: on update', name, value)
  //     // this.updateElementProperty(this.item, this.spec, name, value)
  //   }
  // }
}
</script>

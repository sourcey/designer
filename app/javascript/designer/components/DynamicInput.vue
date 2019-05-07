<template lang="pug">
  component(:is='componentName'
    :name='name'
    :item='item'
    :spec='spec'
    :parent='parent'
    :root='root'
    v-on='$listeners')
</template>

<script>
import StandardInput from './inputs/StandardInput.vue'
import AttachmentInput from './inputs/AttachmentInput.vue'
import AttachmentArrayInput from './inputs/AttachmentArrayInput.vue'
import AttachmentBlobInput from './inputs/AttachmentBlobInput.vue'
import SortableArrayInput from './inputs/SortableArrayInput.vue'
// import TagsInput from './inputs/TagsInput.vue'
import ColorInput from './inputs/ColorInput.vue'
import FontInput from './inputs/FontInput.vue'
import MarkdownTextInput from './inputs/MarkdownTextInput.vue'
// import TrixTextInput from './inputs/TrixTextInput.vue'

export default {
  props: ['spec', 'name', 'item', 'parent', 'root'],
  components: {
    StandardInput,
    AttachmentInput,
    AttachmentArrayInput,
    AttachmentBlobInput,
    SortableArrayInput,
    ColorInput,
    FontInput,
    MarkdownTextInput
    // TagsInput, 
    // TrixTextInput
  },
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
      else if (this.spec.type === 'font')
        return 'FontInput'
      // else if (this.spec.type === 'string' && this.spec.editor === 'trix')
      //   return 'TrixTextInput'
      // else if (this.spec.type === 'string' && this.spec.editor === 'markdown')
      //   return 'MarkdownTextInput'
      else
        return 'StandardInput'
    }
  },
  // created () {
  //   console.log('dynamic input: created', this.$listeners)
  // },
  // methods: {
  //   onSelect(name) {
  //     console.log('dynamic input: on select', name)
  //
  //   },
  //   onUpdate(name, value) {
  //     console.log('dynamic input: on update', name, value)
  //     // this.updateElementProperty(this.item, this.spec, name, value)
  //   }
  // }
}
</script>

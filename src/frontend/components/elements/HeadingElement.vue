<template lang="pug">
//- .element.element-heading.text-content
editable-text(v-model='data.content' :content-tag='tagName' :content-class='classNames' :editor-options='{mode: "basic"}')
</template>

<script>
import EditableText from '../EditableText.vue'

export default {
  components: {
    EditableText
  },
  props: {
    element: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    content () {
      return this.data.content
    },
    size () {
      return this.data.size
    },
    style () {
      return this.data.style
    },
    truncate () {
      return this.data.truncate
    },
    tagName () {
      console.log('heading element: tag name changed', this.size)
      return `h${this.size}`
    },
    classNames () {
      const arr = ['element', 'element-heading', 'text-content']
      if (this.size)
        arr.push(`heading-${this.size}`)
      if (this.style)
        arr.push(this.style)
      if (this.truncate)
        arr.push('truncate')
      return arr
    }
  }
}
</script>

<template>
  <div class="text-content">
    <component :is="tagName" class="element element-heading" :class="classNames" v-html="content" />
  </div>
</template>

<script>
export default {
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
      return `h${this.size}`
    },
    classNames () {
      const arr = []
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

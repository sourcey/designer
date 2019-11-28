<template lang="pug">
.element(:class="'text-' + alignment")
  //- router-link.btn(:to='sitePath(link)' :class='classNames') {{ label }}
  router-link.btn(:to='link' :class='classNames') {{ label }}
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: null
    },
    element: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    label () {
      return this.element.data.label //|| 'Button'
    },
    link () {
      return this.element.data.link // || '#'
    },
    alignment () {
      return this.element.data.alignment //|| 'left'
    },
    classNames () {
      const classes = []
      if (Array.isArray(this.element.data.styles)) {
        this.element.data.styles.forEach(x => classes.push('btn-' + x))
      }
      if (this.element.data.color)
        classes.push('btn-' + this.element.data.color)
      else
        classes.push('btn-default')
      if (this.element.data.size)
        classes.push('btn-' + this.element.data.size)
      return classes
    }
  }
}
</script>

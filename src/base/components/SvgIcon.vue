<template>
  <svg class="icon" :class="`icon-${name}`" :style="svgStyle">
    <use :xlink:href="'#' + name"></use>
  </svg>
</template>

<script>
export default {
  props: {
    name: {
    },
    size: {
      default: false,
    }
  },
  computed: {
    svgStyle () {
      if (this.size) {
        return {
          width: this.size + 'px',
          height: this.size + 'px'
        }
      }
      return {}
    }
  }
}
</script>

<style lang="scss" scoped>
svg {
  display: inline-flex;
  align-self: center;

  // display: inline-block;
  // vertical-align: middle;
  fill: currentColor;
}
</style>

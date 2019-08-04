<template lang="pug">
.overlay(:class='type' :style='css')
</template>

<script>
export default {
  props: {
    type: {
      type: String, // solid | pattern
      default: 'solid'
    },
    color: {
      type: String,
      default: 'black'
    },
    opacity: {
      type: Number,
      default: .3
    }
  },
  computed: {
    css () {
      const style = {}
      if (typeof this.color !== 'undefined') {
        style.backgroundColor = this.color
      }
      if (typeof this.opacity === 'number') {
        style.opacity = this.opacity
      }
      return style
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/_mixins.scss';

.overlay {
  background-position: center;
  // background-repeat: no-repeat;
  @include fill-parent;

  &.solid {
    background-color: rgba(black, .3);
  }

  &.pattern {
    background-image: url('../assets/images/overlay-pattern.png');
  }
}
</style>

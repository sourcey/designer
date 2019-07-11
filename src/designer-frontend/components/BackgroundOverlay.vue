<template>
  <div class="overlay" :class="type" :style="css" />
</template>

<script>
import '../assets/images/image-placeholder.svg'

export default {
  props: {
    type: {
      type: String, // solid | pattern
      default: 'solid'
    },
    opacity: {
      type: Number,
      // default: .3
    }
  },
  computed: {
    css () {
      // if (this.type === 'solid') {
      if (typeof this.opacity === 'number') {
        return { 'background-color': `rgba(0,0,0,${this.opacity})` }
      }
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

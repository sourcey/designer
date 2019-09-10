<template lang="pug">
  .placeholder(:class='mode' :style='backgroundCss')
    icon(:name='icon' size='32')
</template>

<script>
import '../assets/images/image-placeholder.svg?sprite=true'
import '../assets/images/video-placeholder.svg?sprite=true'

export default {
  name: 'placeholder',
  props: {
    mode: {
      type: String,
      default: 'fill-parent'
    },
    icon: {
      type: String,
      default: 'image-placeholder'
    },
    aspectRatio: {
      type: Number,
      default: 1.5
    }
  },
  computed: {
    backgroundCss () {
      const css = {}
      if (this.mode === 'spacer' && this.aspectRatio) {
        css['padding-bottom'] = (100 / this.aspectRatio) + '%'
      }
      return css
    },
  }
}
</script>

<style scoped lang="scss">
$placebolder-background-color: #f3f2f9 !default;

.placeholder {
  position: relative;
  background-color: $placebolder-background-color;
  display: flex;
  align-items: center;
  justify-content: center;

  /deep/ .icon {
    // display: inline-block;
    // position: absolute;
    // top: 50%;
    // left: 50%;
    // margin-top: -16px;
    // margin-left: -16px;
    fill: darken($placebolder-background-color, 5);
  }
}
</style>

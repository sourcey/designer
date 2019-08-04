<template lang="pug">
.layout.layout-image-banner.layout-banner.d-flex.align-items-center(:class="['text-' + textAlignment, {'invert-colors': invertColors }]" :style='layoutCss')
  .container
    slot
  background-overlay(v-if='overlay' v-bind='overlay')
    image-loader(:image='image' v-bind='imageOptions')
</template>

<script>
import ImageLoader from '../ImageLoader.vue'
import BackgroundOverlay from '../BackgroundOverlay.vue'

export default {
  components: {
    ImageLoader,
    BackgroundOverlay
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    image () {
      return this.item.data.image
    },
    invertColors () {
      return this.data.invert_colors
    },
    textAlignment () {
      return this.data.text_alignment || 'inherit'
    },
    layoutCss () {
      if (this.data.screen_height)
        return { 'min-height': this.data.screen_height + 'vh' }
    },
    imageOptions () {
      return {
        cover: 'fill',
        size: 'zoom',
        fillParent: true
      }
    },
    overlay () {
      if (this.data.overlay_type)
        return {
          type: this.data.overlay_type,
          opacity: this.data.overlay_opacity
        }
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/_mixins.scss';

.overlay,
.image {
  z-index: -1;
}
</style>

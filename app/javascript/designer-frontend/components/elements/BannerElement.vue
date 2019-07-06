<template>
  <div class="element wrapper">
    <ImageLoader :image="image" />
    <BackgroundOverlay v-bind="overlay" />
    <div class="fill-parent" :class="flexBoxClasses">
      <slot>
        <div class="text-content mx-auto" :class="'text-' + textAlignment">
          <div class="h1 title" v-html="title"></div>
          <div class="h3 subtitle" v-html="subtitle"></div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import ImageLoader from '../ImageLoader.vue'
import BackgroundOverlay from '../BackgroundOverlay.vue'

export default {
  components: {
    ImageLoader
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
    image () {
      return this.data.image
    },
    title () {
      return this.data.title
    },
    subtitle () {
      return this.data.subtitle
    },
    textAlignment () {
      return this.data.text_alignment
    },
    verticalAlignment () {
      return this.data.vertical_alignment
    },
    flexBoxClasses () {
      switch(this.verticalAlignment) {
        case 'top':
          return 'd-flex align-items-start'
        case 'bottom':
          return 'd-flex align-items-end'
        default:
          return 'd-flex align-items-center'
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

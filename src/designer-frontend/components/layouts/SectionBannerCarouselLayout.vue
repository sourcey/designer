<template>
  <div class="layout layout-banner-carousel layout-banner d-flex align-items-center"
      :class="['text-' + textAlignment, {'invert-colors': invertColors }]" :style="layoutCss">
    <div class="container">
      <slot />
    </div>
    <flickity v-if="showFlickity" class="carousel fill-parent" ref="flickity" :options="flickityOptions">
      <div v-for="(image, index) in images" :key="index" class="carousel-cell w-100">
        <ImageLoader :image="image" v-bind="imageOptions" />
      </div>
    </flickity>
    <BackgroundOverlay v-if="overlay" v-bind="overlay" />
  </div>
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
  data () {
    return {
      showFlickity: false, // must be hidden on render for ssr
      flickityOptions: {
        autoPlay: 6000,
        prevNextButtons: false,
        pageDots: false,
        wrapAround: true
      }
    }
  },
  computed: {
    images () {
      return this.data.images
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
  },
  mounted () {
    this.showFlickity = true
  },
  methods: {
    resetFlickity () {
      console.log('banner carousel layout: reset flickity')
      this.showFlickity = false
      this.$nextTick(() => {
        this.showFlickity = true
      })
    }
  },
  watch: {
  	images: function(newVal, oldVal) {
      this.resetFlickity()
    }
  }
}
</script>

<style scoped lang="scss">
  @import '@/assets/styles/_mixins.scss';

  .overlay,
  .carousel {
    z-index: -1;
  }
</style>

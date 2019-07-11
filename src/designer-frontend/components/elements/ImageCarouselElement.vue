<template>
  <div class="element wrapper">
    <!-- {{ images }} -->
    <!-- type="ImageCarouselElement" :id="id" data-navbar-action="invert" -->
    <flickity v-if="images.length > 0" class="carousel fill-parent invert-arrows" ref="flickity" :options="flickityOptions">
      <div v-for="(image, index) in images" :key="index" class="carousel-cell h-100">
        <!-- <HorizontalExpander :aspectRatio="image.aspect_ratio" /> -->
        <!-- <CoverImage :image="image" size="zoom" /> -->
        <ImageLoader :image="image" size="zoom" :scaleWidth="true" />
      </div>
    </flickity>
  </div>
</template>

<script>
import ImageLoader from '../ImageLoader.vue'

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
  data () {
    return {
      flickityOptions: {
      }
    }
  },
  computed: {
    images () {
      return this.data.images
    }
  },
  mounted () {
    this.$root.$on('layout', this.layout)
  },
  beforeDestroy () {
    this.$root.$off('layout', this.layout)
  },
  methods: {
    layout () {
      if (this.$refs.flickity &&
        this.$refs.flickity.$flickity)
        this.$refs.flickity.resize()
    }
  }
}
</script>

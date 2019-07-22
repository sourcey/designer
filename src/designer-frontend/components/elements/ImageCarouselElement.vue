<template lang="pug">
.element.wrapper
  flickity.carousel.fill-parent.invert-arrows(v-if='images.length > 0' ref='flickity' :options='flickityOptions')
    .carousel-cell.h-100(v-for='(image, index) in images' :key='index')
      image-loader(:image='image' size='zoom' :scalewidth='true')
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

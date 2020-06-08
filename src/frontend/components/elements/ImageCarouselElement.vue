<template lang="pug">
.element.wrapper
  no-ssr
    flickity.carousel.fill-parent.invert-arrows(v-if='images && images.length > 0' ref='flickity' :options='flickityOptions')
      .carousel-cell.w-100.h-100(v-if='image.key' v-for='(image, index) in images' :key='index')
        //- image-loader.h-100(:image='image' size='zoom' fit='cover' :scale-width='true')
        image-loader.h-100(:image='image' size='zoom')
        //- fit='cover' :auto-size='false'
    //- flickity.carousel.fill-parent.invert-arrows(v-if='listings.length > 0' ref='flickity' :options='flickityOptions')
      .carousel-cell(v-for='(listing, index) in listings' :key='index')
        listing-item.h-100(type='cover' :listing='listing' :imageoptions='{scaleWidth: true}')
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

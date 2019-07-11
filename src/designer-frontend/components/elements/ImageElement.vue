<template>
  <div class="element">
    <ImageLoader :image="image" />
    <div class="caption" v-html="caption"></div>
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
  computed: {
    image () {
      return this.data.image
    },
    caption () {
      return this.data.caption
    }
  }
}
</script>

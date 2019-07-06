<template>
  <div class="element d-flex align-items-center" v-if="imagePlacement === 'left'">
    <div class="w-50">
      <ImageLoader class="img-fluid" :image="image" />
    </div>
    <div class="grid-spacer" />
    <div class="text-content">
      <!-- <slot /> -->
      <div class="h1 title" v-html="title"></div>
      <div class="h3 subtitle" v-html="subtitle"></div>
    </div>
  </div>
  <div class="element d-flex align-items-center" v-else-if="imagePlacement === 'right'">
    <div class="text-content">
      <!-- <slot /> -->
      <div class="h1 title" v-html="title"></div>
      <div class="h3 subtitle" v-html="subtitle"></div>
    </div>
    <div class="grid-spacer" />
    <div class="w-50">
      <ImageLoader class="img-fluid" :image="image" />
    </div>
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
    title () {
      return this.data.title
    },
    subtitle () {
      return this.data.subtitle
    },
    image () {
      return this.data.image
    },
    imagePlacement () {
      return this.data.image_placement
    }
  }
}
</script>

<template lang="pug">
.element.wrapper
  placeholder(v-if='empty' icon='video-placeholder')
  iframe(v-else='' :src='url' allowfullscreen='' allowtransparency='' frameborder='0' allow='autoplay')
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
    // url: {
    //   type: String,
    //   default: '#'
    // },
    // aspect_ratio: {
    //   type: Number,
    //   default: 1.7 // 16:9
    // }
  },
  computed: {
    url () {
      return this.data.url
    },
    empty () {
      return !this.url || this.url === '#'
    }
  }
}
</script>

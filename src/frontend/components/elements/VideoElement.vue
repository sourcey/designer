<template lang="pug">
.element.wrapper(:data-aspect-ratio='data.aspect_ratio')
  placeholder(v-if='empty' icon='video-placeholder')
  iframe(v-else :src='url' allowfullscreen='' allowtransparency='' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture')
  //- <iframe width="1033" height="480" src="https://www.youtube.com/embed/UbN7LauS-DU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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

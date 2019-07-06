<template>
  <div class="element wrapper">
    <div v-if="empty" class="placeholder">
      <Icon name="video-placeholder" size="64" />
    </div>
    <!-- <div> -->
     <!--video-responsive  :style="{'padding-bottom': (100 / aspect_ratio) + '%' }" -->
      <iframe v-else :src="url" allowfullscreen allowtransparency frameborder="0" allow="autoplay"></iframe>
    <!-- </div>  class="fill-parent"-->
  </div>
</template>

<script>
import '../../assets/images/video-placeholder.svg'

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

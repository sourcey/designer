<template>
  <!-- <div> -->
    <div class="element text-content" v-html="contentHtml"></div>
  <!-- </div> -->
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
    // placeholder: {
    //   type: String,
    //   default: null // 'Write here...'
    // },
    // content: {
    //   type: String,
    //   default: null // 'Write here...'
    // }
  },
  computed: {
    contentHtml () {
      return this.data.content || this.data.placeholder || 'Write here...'
    }
  }
}
</script>

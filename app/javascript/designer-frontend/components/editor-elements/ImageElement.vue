<template>
  <div class="element">
    <ImageLoader :image="image" />
    <component :is="textEditor" :content="caption" placeholder="Write a caption here …" contentClass="caption" :simpleMode="true" @update="onEditorUpdate" />
  </div>
</template>

<script>
import ImageLoader from '@/components/ImageLoader.vue'

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
      editing: false
    }
  },
  computed: {
    image () {
      return this.data.image
    },
    caption () {
      return this.data.caption // || 'Write a caption here...'
    },
    textEditor () {
      return () => import(/* webpackChunkName: "designer" */ '../TextEditor.vue')
    }
  },
  methods: {
    onEdit (flag) {
      this.editing = flag
    },
    onEditorUpdate (html) {
      this.data.caption = html
      // this.captionHtml = html
    }
  }
}
</script>

<style scoped lang="scss">
</style>

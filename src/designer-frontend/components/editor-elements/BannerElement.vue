<template>
  <div class="wrapper">
    <ImageLoader :image="image" />
    <div class="fill-parent" :class="flexBoxClasses">
      <div class="text-content mx-auto" :class="'text-' + textAlignment">
        <component :is="textEditor" :content="title" contentClass="h1 subtitle" :simpleMode="true" @update="onTextEditorUpdate" />
        <component :is="textEditor" :content="subtitle" contentClass="h3 subtitle" :simpleMode="true" @update="onSubtextEditorUpdate" />
      </div>
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
  data () {
    return {
      editing: false,
      editorFocused: false
    }
  },
  computed: {
    image () {
      return this.data.image
    },
    title () {
      return this.data.title
    },
    subtitle () {
      return this.data.subtitle
    },
    textAlignment () {
      return this.data.text_alignment
    },
    verticalAlignment () {
      return this.data.vertical_alignment
    },
    flexBoxClasses () {
      switch(this.verticalAlignment) {
        case 'top':
          return 'd-flex align-items-start'
        case 'bottom':
          return 'd-flex align-items-end'
        default:
          return 'd-flex align-items-center'
      }
    },
    textEditor () {
      return () => import(/* webpackChunkName: "designer" */ '../TextEditor.vue')
    }
  },
  methods: {
    onEdit (flag) {
      this.editing = flag
    },
    onTextEditorUpdate (html) {
      this.element.data.title = html
    },
    onSubtextEditorUpdate (html) {
      this.element.data.subtitle = html
    }
  }
}
</script>

<style scoped lang="scss">
.text-content {
  width: 75%;
}
</style>

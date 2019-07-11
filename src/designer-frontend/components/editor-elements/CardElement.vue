<template>
  <div class="d-flex align-items-center" v-if="imagePlacement === 'left'">
    <div class="w-50">
      <ImageLoader class="img-fluid" :image="image" />
    </div>
    <div class="grid-spacer" />
    <div class="text-content">
      <component :is="textEditor" :content="title" contentClass="h1 subtitle" :simpleMode="true" @update="onTextEditorUpdate" />
      <component :is="textEditor" :content="subtitle" contentClass="h3 subtitle" :simpleMode="true" @update="onSubtextEditorUpdate" />
    </div>
  </div>
  <div class="d-flex align-items-center" v-else-if="imagePlacement === 'right'">
    <div class="text-content">
      <component :is="textEditor" :content="title" contentClass="h1 subtitle" :simpleMode="true" @update="onTextEditorUpdate" />
      <component :is="textEditor" :content="subtitle" contentClass="h3 subtitle" :simpleMode="true" @update="onSubtextEditorUpdate" />
    </div>
    <div class="grid-spacer" />
    <div class="w-50">
      <ImageLoader class="img-fluid" :image="image" />
    </div>
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
      editing: false,
      editorFocused: false
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
    },
    textEditor () {
      return () => import('../TextEditor.vue')
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
</style>

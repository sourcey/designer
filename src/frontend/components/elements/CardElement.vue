<template lang="pug">
.element.card-image-top(v-if="imagePlacement === 'top'")
  image-loader.img-fluid(:image='image' v-bind='imageOptions')
  .card-content
    editable-text(v-model='data.title' content-class='title' :editor-options='{mode: "basic"}')
    editable-text(v-model='data.subtitle' content-class='subtitle' :editor-options='{mode: "basic"}')
.element.card-image-left.d-flex.align-items-center(v-else-if="imagePlacement === 'left'")
  .w-50
    image-loader.img-fluid(:image='image')
    //- div {{data}}
  .grid-spacer
  .card-content
    editable-text(v-model='data.title' content-class='title' :editor-options='{mode: "basic"}')
    editable-text(v-model='data.subtitle' content-class='subtitle' :editor-options='{mode: "basic"}')
.element.card-image-right.d-flex.align-items-center(v-else-if="imagePlacement === 'right'")
  .card-content
    editable-text(v-model='data.title' content-class='title' :editor-options='{mode: "basic"}')
    editable-text(v-model='data.subtitle' content-class='subtitle' :editor-options='{mode: "basic"}')
  .grid-spacer
  .w-50
    image-loader.img-fluid(:image='image')
</template>

<script>
import EditableText from '../EditableText.vue'

export default {
  components: {
    EditableText
  },
  props: {
    element: {
      type: Object,
      required: true
    },
    data: {
      type: Object,
      required: true
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
    imageOptions () {
      const opts = {}
      if (this.data.image_fit) {
        opts.fit = this.data.image_fit
      }
      if (this.data.image_aspect_ratio) {
        if (!opts.fit) {
          opts.fit = 'cover'
        }
        opts.aspectRatio = this.data.image_aspect_ratio
      }
      return opts
    }
  }
}
</script>

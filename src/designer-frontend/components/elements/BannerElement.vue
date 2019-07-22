<template lang="pug">
.element.wrapper
  image-loader(:image='image')
  background-overlay(v-bind='overlay')
  .fill-parent(:class='flexBoxClasses')
    slot
      .text-content.mx-auto(:class="'text-' + textAlignment")
        editable-text(v-model='data.title' content-tag='h1' content-class='title' :editor-options='{mode: "basic"}')
        editable-text(v-model='data.subtitle' content-tag='h3' content-class='subtitle' :editor-options='{mode: "basic"}')
</template>

<script>
import BackgroundOverlay from '../BackgroundOverlay.vue'
import EditableText from '../EditableText.vue'

export default {
  components: {
    EditableText
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
    overlay () {
      if (this.data.overlay_type) {
        return {
          type: this.data.overlay_type,
          opacity: this.data.overlay_opacity
        }
      }
    }
  }
}
</script>

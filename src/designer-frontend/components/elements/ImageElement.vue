<template lang="pug">
figure.element
  image-loader(:image='image')
  editable-text(v-model='data.caption' content-tag='figcaption' :editor-options='{mode: "basic"}')
  //- content-class='caption'
  //- div {{data}}
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
    // caption () {
    //   return this.data.caption
    // }
  }
}
</script>

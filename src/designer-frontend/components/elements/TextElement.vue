<template lang="pug">
//- .element.text-content(v-html='contentHtml')
editable-text(v-model='data.content' :content='contentHtml' content-class='element text-content')
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
    contentHtml () {
      return this.data.content || this.data.placeholder || 'Write here...'
    }
  }
}
</script>

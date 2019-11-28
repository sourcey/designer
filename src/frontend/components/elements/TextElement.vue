<template lang="pug">
//- .element.text-content(v-html='contentHtml')
editable-text(v-model='data.content' :content='contentHtml' content-class='element text-content' @focused='onEditorFocus')
</template>

<script>
import EditableText from '../EditableText.vue'

export default {
  name: 'text-element',
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
  },
  methods: {
    onEditorFocus (flag) {
      console.log('designer text element: focused', flag) //, html
      this.$store.commit('setDesignerEditingElement', flag ? this.element : null)
    }
  }
}
</script>

<template>
  <!-- <div> -->
    <component class="element" :is="textEditor" :content="content" contentClass="text-content" @focused="onEditorFocused" @update="onEditorUpdate" />
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
  },
  data () {
    return {
      editing: false,
      editorFocused: false,
      // contentHtml: this.content
    }
  },
  computed: {
    content () {
      return this.data.content // || 'Write here...'
    },
    textEditor () {
      return () => import(/* webpackChunkName: "designer" */ '../TextEditor.vue')
    }
  },
  methods: {
    onEdit (flag) {
      this.editing = flag
    },
    onEditorFocused (flag) {
      // console.log('onEditorFocused', flag)
      this.editorFocused = flag
    },
    onEditorUpdate (html) {
      // console.log('onEditorUpdate', html)
      this.data.content = html
    }
  }
}
</script>

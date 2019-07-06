<template>
  <!-- <div> -->
    <!-- <component :is="textEditor" :content="content" contentClass="text-content" @focused="onEditorFocused" @update="onEditorUpdate" /> -->
  <!-- </div> -->
  <component :is="tagName" class="element element-heading" :class="classNames">
    <component :is="textEditor" :content="content" :simpleMode="true" @focused="onEditorFocused" @update="onEditorUpdate" />
  </component>
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
      editorFocused: false
    }
  },
  computed: {
    content () {
      return this.data.content
    },
    size () {
      return this.data.size
    },
    style () {
      return this.data.style
    },
    truncate () {
      return this.data.truncate
    },
    tagName () {
      return `h${this.size}`
    },
    classNames () {
      const arr = []
      if (this.size)
        arr.push(`heading-${this.size}`)
      if (this.style)
        arr.push(this.style)
      if (this.truncate)
        arr.push('truncate')
      return arr
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
      // this.contentHtml = html
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/_mixins.scss';

.heading {
  margin: 0;
}
</style>

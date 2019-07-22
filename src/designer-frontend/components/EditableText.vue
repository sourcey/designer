<template lang="pug">
.wrapper(v-if='designerEditingSection')
  //- component(v-if='editing' :is="textEditor" :content="title" contentClass="h1 teaser" :simpleMode="true") :is='tag' :simple-mode='simpleMode'
  text-editor(:content='contentHtml' :content-tag='contentTag' :content-class='contentClass' v-bind='editorOptions' @update='onUpdate')
div(v-else :is='contentTag || "div"' :class='contentClass' v-html='contentHtml')
</template>

<script>
import DesignerInterface from '../mixins/designer-interface.js'

export default {
  components: {
    TextEditor: () => import(/* webpackChunkName: "designer-vendor" */ './TextEditor.vue')
  },
  mixins: [
    DesignerInterface
  ],
  props: {
    // item: {
    //   type: Object,
    //   // default: () => {}
    //   required: true
    // },
    // name: {
    //   type: String,
    //   // default: () => {}
    //   required: true
    // },
    value: {
      type: String,
      // required: true
    },
    content: {
      type: String,
      // required: true
    },
    contentTag: {
      type: String,
      // default: 'div'
    },
    contentClass: {
      type: String,
      // default: null
    },
    // placeholder: {
    //   type: String,
    //   // default: 'Write here …'
    // },
    // editorMode: {
    //   type: String,
    //   // default: false
    // },
    editorOptions: {
      type: Object,
      // default: () => {}
    }
  },
  computed: {
    // editing () {
    //   // return this.designerPreviewStore.getters.
    //   return this.$store.getters.isEditingElement(this.item.id)
    // },
    contentHtml () {
      // return this.designerPreviewStore.getters.
      // console.log('IMAGEEEEEEEEEEEEEEEe', this.content, this.value)
      // if (this.content && this.content.length)
      //   return this.content
      // return this.value
      return this.content || this.value
    }
  },
  created () {
  },
  methods: {
    onUpdate (html) {
      // this.item.data.subtitle = html
      // console.log('onUpdate', html, this.value)
      this.$emit('input', html)
    }
  }
}
</script>

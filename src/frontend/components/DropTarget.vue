<template lang="pug">
  span.designer-drop-target(:class="[position, {'active': active}]"
    @dragover='dragOver'
    @dragleave='dragLeave'
    @drop='dragDrop')
</template>

<script>
import DesignerInterface from '../mixins/designer-interface.js'
import SpecTools from '../assets/scripts/spec-tools.js'

export default {
  props: {
    position: {
      type: String,
      default: null
    },
    meta: {
      type: Object,
      // default: () => {}
    }
  },
  mixins: [
    DesignerInterface
  ],
  data () {
    return {
      active: false
    }
  },
  methods: {
    dragOver (event) {
      // console.log('drop target: drag over', event.target, this.meta)
      this.active = true
      event.preventDefault() // NOTE: required for ondrop to fire
    },

    dragLeave (event) {
      // console.log('drop target: drag leave', event.target, this.meta)
      this.active = false
      event.preventDefault()
    },

    dragDrop (event) {
      const draggingMeta = this.$store.getters.designerDragging.meta
      // console.log('drop target: drop', event.target, this.meta, draggingMeta)
      SpecTools.moveElement(this.position, draggingMeta, this.meta)
      this.active = false
      this.$store.commit('setDesignerDragging', null)
      this.parentSection.$forceUpdate()
      event.stopPropagation()
    },
  }
}
</script>

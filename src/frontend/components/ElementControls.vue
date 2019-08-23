<template lang="pug">
.designer-element-controls
  .designer-floating-menu.designer-element-menu
    span(v-if='element.label') {{ element.label }}
    a.menu-item(v-if='hasEditableProperties' href='#' @click.prevent='edit') Edit
    a.menu-item.draggable(href='#' @dragstart='dragStart' @dragend='dragEnd')
      //- i.fas.fa-arrows-alt
      icon(name='move' size='12')
    a.menu-item(href='#' @click.prevent='remove')
      icon(name='trash' size='12')
  insertion-point(position='top' :meta='meta')
  insertion-point(v-if='isLastMultiColumnElement' position='bottom' :meta='meta')
  drop-target.element-clip(v-if='$store.getters.designerDragging' position='top' :meta='meta')
  drop-target.element-clip(v-if='$store.getters.designerDragging' position='bottom' :meta='meta')
  resize-handle.designer-element-resize-handle(v-if='focused && resizable || resizing' @start='resizeStart' @drag='resize' @end='resizeEnd')
</template>

<script>
import InsertionPoint from './InsertionPoint.vue'
import ResizeHandle from './ResizeHandle.vue'
import DropTarget from './DropTarget.vue'
import DesignerInterface from '../mixins/designer-interface.js'
import SpecTools from '../assets/scripts/spec-tools.js'

import '../assets/images/move.svg?sprite=true'
import '../assets/images/trash.svg?sprite=true'

export default {
  components: {
    InsertionPoint,
    ResizeHandle,
    DropTarget
  },
  mixins: [
    DesignerInterface
  ],
  props: {
    element: {
      type: Object,
      default: () => {}
    },
    meta: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      editing: false,
      focused: false,
      resizing: false,
      // rect: null,
      // dropTargets: ['top', 'bottom']
    }
  },
  computed: {
    spec () {
      return this.$store.getters.designerElementSpec(this.element.name) || {}
    },
    draggable () {
      return this.spec.draggable !== false // && !this.resizing
    },
    resizable () {
      return this.spec.resizable
    },
    // layout () {
    //   return this.element.data && this.element.data.layout ?
    //       this.element.data.layout : 'default'
    // },
    // elementComponent () {
    //   return this.importElement(this.element.name, true) // this.$parent.$parent.editing
    // },
    // elementStyle () {
    //   const style = {}
    //   if (this.element.data.aspect_ratio && this.rect) {
    //     style.minHeight = (this.rect.width / this.element.data.aspect_ratio) + 'px'
    //   }
    //   return style
    // },
    numSiblings () {
      // console.log('NUM BIBS', this, this.meta, this.spec)

      return this.meta.column ? this.meta.column.items.length : 0
      // return this.meta.column ?
      //   this.meta.column.items.length :
      //   this.meta.parent.items.length
    },

    // Use this to hide the bottom insertion point so it doesnt overlap the
    // row insertion point
    isLastMultiColumnElement () {
      return this.meta.elementIndex === this.numSiblings - 1 &&
          this.meta.column && this.meta.column.span < 12
    },
    hasEditableProperties () {
      for (const key in this.spec.properties) {
        if (!this.spec.properties[key].hidden)
          return true
      }
      return false
    }
  },
  mounted () {
    // this.onWindowResize()
    // this.rect = this.$el.getBoundingClientRect()
    this.$parent.$el.addEventListener('click', this.onParentClick)
    window.addEventListener('click', this.onWindowClick) //
    // window.addEventListener('resize', this.onWindowResize) //

    // if (this.draggable) {
    //   this.$parent.$el.addEventListener('dragstart', this.onParentDragStart)
    //   this.$parent.$el.addEventListener('dragend', this.onParentDragEnd)
    // }

    // console.log(this.element.name)
    // if (this.element.name === 'poster') this.edit()
  },
  beforeDestroy () {
    this.$parent.$el.removeEventListener('click', this.onParentClick)
    window.removeEventListener('click', this.onWindowClick) //
    // window.removeEventListener('resize', this.onWindowResize) //

    // if (this.draggable) {
    //   this.$parent.$el.removeEventListener('dragstart', this.onParentDragStart)
    //   this.$parent.$el.removeEventListener('dragend', this.onParentDragEnd)
    // }
  },
  methods: {
    onParentClick (event) {
      this.focused = true
    },
    onWindowClick (event) {
      if (!this.$parent.$el.contains(event.target)) {
        this.focused = false
      }
    },
    // onWindowResize () {
    //   this.rect = this.$el.getBoundingClientRect()
    // },

    // Drag & drop
    // --------------------------------------------------
    // onParentDragStart (event) {
    //   console.log('element: onParentDragStart', event)
    // },
    //
    // onParentDragEnd (event) {
    //   console.log('element: onParentDragEnd', event)
    // },

    dragStart (event) {
      console.log('element: dragStart', this.$parent.$el, this.draggable)
      if (this.draggable && !this.resizing) {
        this.$parent.$el.draggable = true
        this.$store.commit('setDesignerDragging', this)
        // event.preventDefault()
      }
    },
    dragEnd () {
      console.log('element: dragEnd')
      if (this.draggable && !this.resizing) {
        this.$parent.$el.draggable = false
        this.$store.commit('setDesignerDragging', null)
      }
    },

    // Resizing (vertical)
    // --------------------------------------------------

    resizeStart () {
      console.log('element: resizeStart')

      this.$store.commit('setDesignerResizing', this)
      this.resizing = true
    },

    resize (pos) {
      const rect = this.$parent.$el.getBoundingClientRect(), //$parent.rect, //
        height = Math.abs(pos.y - rect.top),
        aspectRatio = rect.width / height

      // Set the element aspect ratio which will be used to size it responsively
      console.log('element: resize', pos, height, aspectRatio)
      this.$set(this.element.data, 'aspect_ratio', aspectRatio)
      // this.element.data.aspect_ratio = aspectRatio
    },

    resizeEnd (pos) {
      console.log('element: resizeEnd', pos)
      this.$store.commit('setDesignerResizing', null)
      this.resizing = false
    },

    // Designer editor
    // --------------------------------------------------
    //
    // createElement (event, valign) {
    //   console.log('element: createElement', event)
    //   const pos = { x: event.clientX + 100, y: event.clientY }
    //   this.designerBackend.createElement(event, (element) => {
    //     if (valign === 'top') {
    //       SpecTools.insertElementTop(element, this.meta)
    //     } else {
    //       SpecTools.insertElementBottom(element, this.meta)
    //     }
    //   })
    // },
    edit (event) {
      this.editing = true
      // const pos = event ? { x: event.clientX + 100, y: event.clientY } : {}

      this.$store.commit('setDesignerEditingElement', this.element)
      this.designerBackend.editElement(event, this.element) // this.spec, this.meta
    },
    remove () {
      if (confirm("Are you sure?")) {
        SpecTools.removeElement(this.meta, true)
      }
    }
  },
  watch: {
  	editing: function(value) {
      this.toggleParentClass (value, 'editing')
      // this.$parent.editing = value
    },
  	focused: function(value) {
      this.toggleParentClass (value, 'focused')
      // this.$parent.focused = value
    },
  	resizing: function(value) {
      this.toggleParentClass (value, 'resizing')
      // this.$parent.resizing = value
    },
  }
}
</script>

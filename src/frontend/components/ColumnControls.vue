<template lang="pug">
.designer-col-controls
  //- (:class="'col-md-' + column.span")
  resize-handle.designer-resize-handle.left(v-if='!firstColumn' @drag='resizeLeft($event, meta.row, meta.columnIndex, $el)' @end='resizeEnd')
  resize-handle.designer-resize-handle.right(v-if='!lastColumn' @drag='resizeRight($event, meta.row, meta.columnIndex, $el)' @end='resizeEnd')
  //- span.designer-drop-line-indicator.left(:class="{'show': $store.getters.designerDragging && showDropIndicator === 'left'}")
  //- span.designer-drop-line-indicator.right(:class="{'show': $store.getters.designerDragging && showDropIndicator === 'right'}")
  //- span {{showDropIndicator}}
  //- span.drop-test-top.cola(@mousemove='dropTest')
  drop-target.column-clip(v-if='$store.getters.designerDragging' position='left' :meta='meta')
  drop-target.column-clip(v-if='$store.getters.designerDragging' position='right' :meta='meta')
  //- div  {{ column.items }}
  //- div rowIndex: {{ meta.rowIndex }}
  //- div columnIndex: {{ meta.columnIndex }}
  //- element-renderer(
  //-     v-for='(element, elementIndex) in column.items'
  //-     :key='elementIndex'
  //-     :element='element'
  //-     :elementIndex='elementIndex'
  //-     :meta='Object.assign({element: element, elementIndex: elementIndex}, meta)')
  //-   //- element-renderer(
  //-   //-     v-for='(childElement, childElementIndex) in setElementDefaults(element).children'
  //-   //-     :key='childElementIndex'
  //-   //-     :element='childElement'
  //-   //-     :meta='{parent: element, element: childElement, elementIndex: elementIndex}')
</template>

<script>
// import ElementRenderer from './renderers/ElementRenderer.vue'
import ResizeHandle from './ResizeHandle.vue'
import DropTarget from './DropTarget.vue'
import DesignerInterface from '../mixins/designer-interface.js'
import ResizableGrid from '../mixins/resizable-grid.js'

export default {
  components: {
    // ElementRenderer,
    ResizeHandle,
    DropTarget,
  },
  // name: 'SectionRenderer',,
  mixins: [
    DesignerInterface,
    // Draggable,
    ResizableGrid
  ],
  props: {
    // column: {
    //   type: Object,
    //   default: () => {}
    // },
    meta: {
      type: Object,
      default: () => {}
    },
    // rowIndex: {
    //   type: Number,
    //   default: null
    // },
    // columnIndex: {
    //   type: Number,
    //   default: null
    // }
  },
  data () {
    return {
      // dropTargets: ['left', 'right']
    }
  },
  computed: {
    // meta () {
    //   return {parent: this.column, row: this.row, column: this.column, rowIndex: this.rowIndex, columnIndex: this.columnIndex}
    // },
    firstColumn () {
      return this.meta.columnIndex === 0
    },
    lastColumn () {
      // console.log('COLUMNNNNNNNNNNNNN', this.meta)
      return this.meta.columnIndex === this.meta.row.columns.length - 1
    },
    // dropTargets () {
    //   return ['left', 'right']
    //   // return this.meta.elementIndex === this.meta.column.items.length - 1
    // }
  },
  // methods: {
  //   elementSpec (element) {
  //     return this.$store.getters.designerElementSpec(element.name)
  //   },
  //   elementChildren (element) {
  //     return element.children || this.elementSpec(element).children
  //   },
  // }
}
</script>

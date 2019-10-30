<template lang="pug">
.designer-row-controls
  insertion-point(position='top' :meta='meta')
  insertion-point(v-if='isLastRow' position='bottom' :meta='meta')
  //- span.designer-insertion-point.top(:class="{'show': showInsertionPoint === 'top'}" @click="createElement($event, 'top')")
  //- span.designer-insertion-point.bottom(:class="{'show': showInsertionPoint === 'bottom'}" @click="createElement($event, 'bottom')")
  //- span.designer-drop-line-indicator.top(:class="{'show': showDropIndicator === 'top'}")
  //- span.designer-drop-line-indicator.bottom(:class="{'show': showDropIndicator === 'bottom'}")
  //- span {{ showInsertionPoint }}
  drop-target.row-clip(v-if='$store.getters.designerDragging' position='top' :meta='meta')
  drop-target.row-clip(v-if='$store.getters.designerDragging' position='bottom' :meta='meta')
  //- grid-column(
  //-     v-for='(column, columnIndex) in row.columns'
  //-     :key='columnIndex'
  //-     :column='column'
  //-     :meta='Object.assign({column: column, columnIndex: columnIndex}, meta)')
  //- :row='row' :column='column' :rowIndex='rowIndex' :columnIndex='columnIndex'
</template>

<script>
// import GridColumn from './renderers/GridColumn.vue'
import InsertionPoint from './InsertionPoint.vue'
import DropTarget from './DropTarget.vue'
import DesignerInterface from '../mixins/designer-interface.js'
import SpecTools from '../assets/scripts/spec-tools.js'

export default {
  // name: 'GridRow',
  components: {
    // GridColumn,
    InsertionPoint,
    DropTarget
  },
  mixins: [
    DesignerInterface
  ],
  props: {
    rows: {
      type: Array,
      default: () => []
    },
    row: {
      type: Object,
      default: () => {}
    },
    meta: {
      type: Object,
      default: () => {}
    },
    // rowIndex: {
    //   type: Number,
    //   default: null
    // }
  },
  data () {
    return {
      // dropTargets: ['bottom']
    }
  },
  computed: {
    // meta () {
    //   return {parent: this.parent, row: this.row, rowIndex: this.rowIndex} //, column: this.column, columnIndex: this.columnIndex
    // },
    isLastRow () {
      // console.log('IS LAST ROW', this.meta.rowIndex === this.meta.parent.items.length - 1)
      return this.meta.rowIndex === this.meta.parent.items.length - 1
    },
    // dropTargets () {
    //   return ['top', 'bottom']
    //   // return this.meta.elementIndex === this.meta.column.elements.length - 1
    // }
  },
  methods: {

    // Designer editor
    // --------------------------------------------------

    // createElement (event, valign) {
    //   const pos = { x: event.clientX + 100, y: event.clientY }
    //   this.designerBackend.createElement(event, (element) => {
    //     if (element) {
    //       if (valign === 'top') {
    //         SpecTools.insertElementRowTop(element, this.meta)
    //       } else {
    //         SpecTools.insertElementRowBottom(element, this.meta)
    //       }
    //     }
    //   })
    // },
  }
}
</script>

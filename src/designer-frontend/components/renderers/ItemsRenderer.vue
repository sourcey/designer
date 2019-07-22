<template lang="pug">
div
  div(v-for='(row, rowIndex) in item.items' :key='rowIndex')
    element-renderer(v-if="row.type === 'element'" :element='row' :meta='{parent: item, element: row, elementIndex: rowIndex}')
    // :layout="row.data && row.data.layout ? row.data.layout : 'element_default'"
    .row.layout-row.no-gutters(v-if="row.type === 'row'")
      component(v-if='designerEditingSection' :is='designerRowControls' :meta='{parent: item, row: row, rowIndex: rowIndex}')
      .layout-col(v-for='(column, columnIndex) in row.columns' :key='columnIndex' :class="'col-md-' + column.span")
        component(v-if='designerEditingSection' :is='designerColumnControls' :meta='{parent: item, row: row, rowIndex: rowIndex, column: column, columnIndex: columnIndex}')
        element-renderer(v-for='(columnItem, columnItemIndex) in column.items' :key='columnItemIndex' :element='columnItem' :meta='{parent: item, row: row, rowIndex: rowIndex, column: column, columnIndex: columnIndex, element: columnItem, elementIndex: columnItemIndex}')
            // :layout="columnItem.data && columnItem.data.layout ? columnItem.data.layout : 'element_default'"
</template>

<script>
import ElementRenderer from './ElementRenderer.vue'
import DesignerInterface from '../../mixins/designer-interface.js'
// import { importThemeLayout } from '@/assets/scripts/utils'

export default {
  components: {
    ElementRenderer,
  },
  mixins: [
    DesignerInterface
  ],
  props: {
    // section: {
    //   type: Object,
    //   default: () => {}
    // },
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    designerRowControls () {
      return () => import(/* webpackChunkName: "designer-vendor" */ '../RowControls.vue')
    },
    designerColumnControls () {
      return () => import(/* webpackChunkName: "designer-vendor" */ '../ColumnControls.vue')
    }
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

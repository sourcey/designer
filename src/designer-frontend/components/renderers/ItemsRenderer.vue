<template>
  <div>
    <div v-for="(row, rowIndex) in item.items" :key="rowIndex">
      <ElementRenderer
          v-if="row.type === 'element'"
          :element="row"
          :meta="{parent: item, element: row, elementIndex: rowIndex}" />
          <!-- :layout="row.data && row.data.layout ? row.data.layout : 'element_default'" -->
      <div v-if="row.type === 'row'" class="row layout-row no-gutters">
        <component
            v-if="designerEditingSection"
            :is="designerRowControls"
            :meta="{parent: item, row: row, rowIndex: rowIndex}" />
        <div v-for="(column, columnIndex) in row.columns" :key="columnIndex" class="layout-col" :class="'col-md-' + column.span">
          <component
              v-if="designerEditingSection"
              :is="designerColumnControls"
              :meta="{parent: item, row: row, rowIndex: rowIndex, column: column, columnIndex: columnIndex}" />
          <ElementRenderer
              v-for="(columnItem, columnItemIndex) in column.items"
              :key="columnItemIndex"
              :element="columnItem"
              :meta="{parent: item, row: row, rowIndex: rowIndex, column: column, columnIndex: columnIndex, element: columnItem, elementIndex: columnItemIndex}" />
              <!-- :layout="columnItem.data && columnItem.data.layout ? columnItem.data.layout : 'element_default'" -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DesignerInterface from '../../mixins/designer-interface.js'
import ElementRenderer from './ElementRenderer.vue'
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
      default: () => {}
    }
  },
  computed: {
    designerRowControls () {
      return () => import(/* webpackChunkName: "designer" */ '../RowControls.vue')
    },
    designerColumnControls () {
      return () => import(/* webpackChunkName: "designer" */ '../ColumnControls.vue')
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

export default {
  data () {
    return {
      resizeState: null
    }
  },
  computed: {
    rowElement () {
      return this.$el.closest('.row')
    }
  },
  methods: {
    resizeLeft (pos, row, columnIndex) {
      const currColumn = row.columns[columnIndex]
      const prevColumn = row.columns[columnIndex - 1]
      const contentRect = this.rowElement.getBoundingClientRect()
      // const columnWidth = this.rowElement.offsetWidth / 12
      const columnWidth = contentRect.width / 12
      const initialX = pos.rect.left - contentRect.left
      const offsetX = pos.x - contentRect.left

      // Set the initial column span so we can calculate the offset
      if (!this.resizeState) {
        this.resizeState = {
          currSpan: currColumn.span,
          prevSpan: prevColumn.span,
          totalSpan: currColumn.span + prevColumn.span
        }
        this.$store.commit('setDesignerResizing', this)
      }

      // Calculate new column spans
      const resizeSpan = parseInt((initialX - offsetX) / columnWidth)
      const diffSpan = Math.abs(resizeSpan)
      const newCurrSpan = this.resizeState.currSpan + resizeSpan
      const newPrevSpan = this.resizeState.prevSpan - resizeSpan

      // Check span has changed and is non-zero
      if (newCurrSpan === currColumn.span || newCurrSpan < 1 || newPrevSpan < 1) {
        return
      }

      this.$set(currColumn, 'span', newCurrSpan)
      this.$set(prevColumn, 'span', newPrevSpan)
    },

    // resizeRight (pos, row, columnIndex) {
    //   const currColumn = row.columns[columnIndex]
    //   const nextColumn = row.columns[columnIndex + 1]
    //   const contentRect = this.rowElement.getBoundingClientRect()
    //   // const columnWidth = this.rowElement.offsetWidth / 12
    //   const columnWidth = contentRect.width / 12
    //   const initialX = pos.rect.right - contentRect.right
    //   const offsetX = pos.x - contentRect.right
    //
    //   // Set the initial column span so we can calculate the offset
    //   if (!this.resizeState) {
    //     this.resizeState = {
    //       currSpan: currColumn.span,
    //       nextSpan: nextColumn.span,
    //       totalSpan: currColumn.span + nextColumn.span
    //     }
    //     this.$store.commit('setDesignerResizing', this)
    //   }
    //
    //   // Calculate new column spans
    //   const resizeSpan = parseInt((initialX - offsetX) / columnWidth)
    //   const diffSpan = Math.abs(resizeSpan)
    //   const newCurrSpan = this.resizeState.currSpan - resizeSpan
    //   const newPrevSpan = this.resizeState.nextSpan + resizeSpan
    //
    //   // Check span has changed and is non-zero
    //   if (newCurrSpan === currColumn.span || newCurrSpan < 1 || newPrevSpan < 1) {
    //     return
    //   }
    //
    //   this.$set(currColumn, 'span', newCurrSpan)
    //   this.$set(nextColumn, 'span', newPrevSpan)
    // },

    resizeEnd () {
      console.log('resize end', this.resizeState)
      this.resizeState = null
      this.$store.commit('setDesignerResizing', null)
    }
  }
}

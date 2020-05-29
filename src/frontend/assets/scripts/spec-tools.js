import Balancer from './balancer'
import Vue from 'vue'


// Tools for manupulating the designer spec
export default {

  // The number of columns supported in layouts
  COLUMNS: 12,

  // Create a column and insert in into the row
  createColumn (element, row, index, span = undefined) { //, normalize = false
    span = span || this.COLUMNS / row.columns.length
    const newColumn = {
      span: span,
      items: [
        element
      ]
    }

    row.columns.splice(index, 0, newColumn)
    // if (normalize)
    this.normalizeColumns(row)
  },

  // Create a column and insert in into the row
  createRow (element, container, index = 0) {
    // const span = this.COLUMNS / targetMeta.row.columns.length
    const newRow = {
      type: 'row',
      columns: [
        {
          span: 12,
          items: [
            element
          ]
        }
      ]
    }

    // console.log('createRow', index)
    container.splice(index, 0, newRow)
    this.normalizeColumns(newRow)
  },

  insertElementRowTop (element, targetMeta) {
    // this.removeElement(sourceMeta)
    // meta.element = element
    console.log('insertElementRowTop', element, targetMeta)
    // targetMeta.column.items.splice(targetMeta.columnElementIndex, 0, element)
    this.createRow(element, targetMeta.parent.items, targetMeta.rowIndex)
  },

  insertElementRowBottom (element, targetMeta) {
    // this.removeElement(sourceMeta)
    // meta.element = element
    console.log('insertElementRowBottom', element, targetMeta)
    // targetMeta.column.items.splice(targetMeta.columnElementIndex + 1, 0, element)
    // this.createColumn(meta, targetMeta, targetMeta.columnIndex)
    this.createRow(element, targetMeta.parent.items, targetMeta.rowIndex + 1)
  },

  insertElementTop (element, targetMeta) {
    console.log('insertElementTop', element, targetMeta)
    if (targetMeta.column) {
      this.insertElementIntoColumn(element, targetMeta, 0)
    } else {
      this.insertElementRowTop(element, targetMeta)
    }
  },

  insertElementBottom (element, targetMeta) {
    console.log('insertElementBottom', element, targetMeta)
    if (targetMeta.column) {
      this.insertElementIntoColumn(element, targetMeta, 1)
    } else { // if (targetMeta.row || targetMeta.parent.items) {
      this.insertElementRowBottom(element, targetMeta)
    }
  },

  // Insert the sourceMeta element as a column to the left of the targetMeta column
  moveElementLeft (sourceMeta, targetMeta) {
    console.log('moveElementLeft', sourceMeta, targetMeta)
    // if (sourceMeta.columnIndex === targetMeta.columnIndex &&
    //   sourceMeta.rowIndex === targetMeta.rowIndex) {
    //   console.log('skipping')
    //   return
    // }
    this.createColumn(sourceMeta.element, targetMeta.row, targetMeta.columnIndex, sourceMeta.column.span)
    this.removeElement(sourceMeta)
    // this.removeElement(sourceMeta, true)
    // this.removeElement(sourceMeta, true)
  },

  // Insert the sourceMeta element as a column to the right of the targetMeta column
  moveElementRight (sourceMeta, targetMeta) {
    console.log('moveElementRight', sourceMeta, targetMeta)
    // if ((sourceMeta.columnIndex === targetMeta.columnIndex ||
    //   sourceMeta.columnIndex === targetMeta.columnIndex + 1) &&
    //   sourceMeta.rowIndex === targetMeta.rowIndex) {
    //   console.log('skipping')
    //   return
    // }
    this.createColumn(sourceMeta.element, targetMeta.row, targetMeta.columnIndex + 1, sourceMeta.column.span) //
    this.removeElement(sourceMeta)
    // this.removeElement(sourceMeta, true)
    // this.removeElement(sourceMeta, true)
  },

  // Insert the sourceMeta element above the targetMeta element
  moveElementTop (sourceMeta, targetMeta) {
    console.log('moveElementTop', sourceMeta, targetMeta)
    this.removeElement(sourceMeta)
    this.insertElementTop(sourceMeta.element, targetMeta)
    // if (targetMeta.column) {
    //   this.insertElementIntoColumn(sourceMeta.element, targetMeta, 0)
    // } else { // if (targetMeta.row || targetMeta.parent.items) {
    //   this.insertElementRowTop (sourceMeta.element, targetMeta)
    // }
    // this.removeElement(sourceMeta, true)
    // this.normalizeColumns(sourceMeta.row)
  },

  // Insert the sourceMeta element below the targetMeta element
  moveElementBottom (sourceMeta, targetMeta) {
    console.log('moveElementBottom', sourceMeta, targetMeta)
    this.removeElement(sourceMeta)
    this.insertElementBottom(sourceMeta.element, targetMeta)
    // if (targetMeta.column) {
    //   this.insertElementIntoColumn(sourceMeta.element, targetMeta, 1)
    // } else { // if (targetMeta.row || targetMeta.parent.items) {
    //   this.insertElementRowBottom (sourceMeta.element, targetMeta)
    // }
    // this.removeElement(sourceMeta, true)
    // this.normalizeColumns(sourceMeta.row)
  },

  // Move an element to the given target position
  moveElement (position, sourceMeta, targetMeta) {
    if (position === 'left') {
      this.moveElementLeft(sourceMeta, targetMeta)
    } else if (position === 'right') {
      this.moveElementRight(sourceMeta, targetMeta)
    } else if (position === 'top') {
      this.moveElementTop(sourceMeta, targetMeta)
    } else if (position === 'bottom') {
      this.moveElementBottom(sourceMeta, targetMeta)
    }
  },

  insertElementIntoColumn (element, targetMeta, offset = 0) {
    console.log('insertElementIntoColumn', targetMeta)
    const index = this.columnElementIndex(targetMeta)
    targetMeta.column.items.splice(index + offset, 0, element)
  },

  // Returns the real columnElementIndex of the meta element.
  // NOTE: columnElementIndex may be unreliable after modifying the layout so
  // object checking is used instead.
  columnElementIndex (meta) {
    return meta.column.items.findIndex(x => Object.is(meta.element, x))
  },

  columnIndex (meta) {
    return meta.row.columns.findIndex(x => Object.is(meta.column, x))
  },

  rowIndex (meta) {
    return meta.parent.items.findIndex(x => Object.is(meta.row, x))
  },

  // Detach a element from its column, and remove the column if empty
  removeElement (meta) { //, normalize = false
    // NOTE: columnElementIndex may be unreliable after modifying the layout, so perform
    // object checking to find the index instead
    // sourceMeta.column.items.splice(sourceMeta.columnElementIndex, 1)

    const index = this.columnElementIndex(meta)
    if (index === -1) {
        console.log('spec tools: ERROR: no column element index', meta)
    }
    meta.column.items.splice(index, 1)
    meta.column.items = [...meta.column.items]

    console.log('spec tools: remove element', index, meta.columnElementIndex, meta)

    // Remove the column if it's empty (done via normalizeColumns)
    // if (meta.row && !meta.column.items.length) { //normalize &&
    //   console.log('spec tools: delete empty column', meta)
    //   const columnIndex = this.columnIndex(meta)
    //   meta.row.columns.splice(columnIndex, 1)
    //   meta.row.columns = [...meta.row.columns]
    //   // meta.row.columns.splice(meta.columnIndex, 1)
    // }

    this.normalizeColumns(meta.row)

    // Remove the row if it's empty
    if (meta.row && !meta.row.columns.length) {
      const rowIndex = this.rowIndex(meta)
      console.log('spec tools: delete empty row', meta, rowIndex)
      meta.parent.items.splice(rowIndex, 1)
      meta.parent.items = [...meta.parent.items]
      // meta.parent.items = []
      // Vue.set(meta.parent, 'items', [])
      // meta.row.columns.splice(meta.columnIndex, 1)
    }
  },

  // Normalize the column spans after inserting a new element
  normalizeColumns (row) {
    row.columns = row.columns.filter(x => x.items.length)
    const spans = row.columns.map(x => x.span)
    console.log('spec tools: normalize columns', spans)
    const normalized = Balancer.balance(spans, 12, 0)
    row.columns.forEach((x, i) => x.span = normalized[i])

    // NOTE: This seems to fix Vue reactivity issues when adding / removing
    // items, although its not ideal as it causes the entire grid to rerender.
    row.columns = [...row.columns]
  },

  // Merge spec defaults into the item data (for use with designer)
  // NOTE: Done server side
  // mergeSpecDefaults (item, spec) {
  //   if (!item.id)
  //     item.id = item.name + '-' + randomString(8)
  //   if (!item.data)
  //     item.data = {}
  //   if (spec.properties) {
  //     Object.keys(spec.properties).forEach(x => {
  //       if (typeof(item.data[x]) === 'undefined' && typeof(spec.properties[x].default) !== 'undefined') {
  //         item.data[x] = spec.properties[x].default
  //       }
  //     })
  //   }
  // }
}

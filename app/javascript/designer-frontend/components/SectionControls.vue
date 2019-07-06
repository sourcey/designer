<template lang="pug">
.designer-section-controls
  //- (:class="{'dragging': dragging, 'resizing': resizing, 'editing': editing}")
  .designer-floating-menu.designer-section-menu(v-if='!editing')
    span.menu-item {{ section.data.label || section.label }}
    a.menu-item(href='#' @click.prevent='edit') Edit
    a.menu-item(href='#' @click.prevent='remove')
      icon(name='trash' size='12')
    .flex-fill
    a.menu-item(href='#' @click.prevent='insertSection') Insert Section
    //- a.menu-item(href='#' @click.prevent='editPageSections') Manage Sections
  .designer-floating-menu.designer-section-menu(v-else)
    span.menu-item {{ section.data.label || section.label }}
    a.menu-item(href='#' @click.prevent='save') Save
    a.menu-item(href='#' @click.prevent='editSettings') Settings
    a.menu-item(href='#' @click.prevent='cancel') Cancel
    a.menu-item(href='#' @click.prevent='remove')
      icon(name='trash' size='12')
    .flex-fill
    a.menu-item(href='#' @click.prevent='addElement') Add Element
</template>

<script>
import DesignerInterface from '../mixins/designer-interface.js'
import SpecTools from '../assets/scripts/spec-tools.js'
import '../assets/images/trash.svg'

export default {
  props: {
    section: {
      type: Object,
      default: () => {}
    }
  },
  mixins: [
    DesignerInterface
  ],
  data () {
    return {
      restoreState: null
    }
  },
  watch: {
  	editing: function(value) {
      this.toggleParentClass (value, 'editing')
    },
  	dragging: function(value) {
      this.toggleParentClass (value, 'dragging')
    },
  	resizing: function(value) {
      this.toggleParentClass (value, 'resizing')
    },
  },
  computed: {
    editing () {
      return this.$store.getters.isEditingSection(this.section.id)
    },
    dragging () {
      return !!this.$store.getters.designerDragging
    },
    resizing () {
      return !!this.$store.getters.designerResizing
    }
  },
  mounted () {
    // If this is the only section and it has no items start
    // editing straight away
    if (this.designerPage.sections.length === 1 &&
      (!this.section.items || !this.section.items.length)) {
      this.edit()
    }
  },
  methods: {
    edit () {

      // Create a default text row if the section is empty
      if (!this.section.items || !this.section.items.length) {
        this.section.items = []
        const textElement = this.designerBackend.createElementData('text')
        SpecTools.createRow(textElement, this.section.items)
      }

      this.restoreState = JSON.parse(JSON.stringify(this.section))

      // Expand the preview and wait or the animation to complete before
      // rerendering
      this.designerBackend.expandPreview(true)
      setTimeout(() => { this.$store.commit('setDesignerEditingSection', this) }, 500)
    },
    remove () {
      const removed = this.designerBackend.removePageSection(this.designerPage, this.section.id)
      if (removed)
        this.exitPreview()
    },
    exitPreview () {
      if (!this.editing) return
      this.designerBackend.expandPreview(false)
      setTimeout(() => { this.$store.commit('setDesignerEditingSection', null) }, 500)
    },
    cancel () {
      Object.keys(this.restoreState).forEach(key => {
        this.$set(this.section, key, this.restoreState[key])
      })
      this.restoreState = null
      this.exitPreview()
    },
    addElement (event) {
      console.log('element: createElement', event)
      this.designerBackend.createElement(event, (element) => {
        SpecTools.createRow(element, this.section.items)
        // this.section.items = [...this.section.items]
      })
    },
    editSettings (event) {
      // const pos = event ? { x: event.clientX + 100, y: event.clientY } : {}
      // const layoutSpec = this.$store.getters.designerLayoutSpec(this.layout)
      this.designerBackend.editSection(event, this.section) //layoutSpec,
    },
    editPageSections (event) {
      this.designerBackend.editPageSections(event, this.designerPage)
    },
    insertSection () {
      this.designerBackend.insertPageSection(event, this.designerPage, this.section.index)
    },
    save () {
      this.designerBackend.savePage(this.designerPage)
      this.exitPreview()
      // this.designerBackend.expandPreview(false)
      // setTimeout(() => { this.$store.commit('setDesignerEditingSection', null) }, 500)
      // this.$store.commit('setDesignerEditingSection', null)
    }
  }
}
</script>

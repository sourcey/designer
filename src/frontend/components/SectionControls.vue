<template lang="pug">
.designer-section-controls(:class='{pinned: onscreen}')
  //- div HOIS {{editing}}
  //- div {{$store.state.designer.editingSection}}
  //- div {{$store.state.editingSection}}
  //- (:class="{'dragging': dragging, 'resizing': resizing, 'editing': editing}")
  .designer-floating-menu.designer-section-menu(v-if='!editing')
    span.menu-item {{ label }}
    a.menu-item(href='#' @click.prevent='edit') Edit
    a.menu-item(href='#' @click.prevent='remove')
      icon(name='trash' size='12')
    .flex-fill
    a.menu-item(href='#' @click.prevent='insertSection') Insert Section
    //- a.menu-item(href='#' @click.prevent='editPageSections') Manage Sections
  .designer-floating-menu.designer-section-menu(v-else)
    span.menu-item {{ label }}
    a.menu-item(href='#' @click.prevent='save') Save
    a.menu-item(href='#' @click.prevent='editSettings') Settings
    a.menu-item(href='#' @click.prevent='cancel') Cancel
    a.menu-item(href='#' @click.prevent='remove')
      icon(name='trash' size='12')
    .flex-fill
    a.menu-item(v-if='layoutSpec.content !== false' href='#' @click.prevent='addElement') Add Element
</template>

<script>
import DesignerInterface from '../mixins/designer-interface.js'
import SpecTools from '../assets/scripts/spec-tools.js'

import '../assets/images/trash.svg?sprite=true'

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
      restoreState: null,
      onscreen: false
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
    },
    label () {
      return this.section.data && this.section.data.label ?
          this.section.data.label :
          this.section.label
    },
    layoutSpec () {
      return this.$store.getters.designerLayoutSpec(this.$parent.layout)
    }
  },
  mounted () {
    // If this is the only section and it has no items start
    // editing straight away
    // if (this.designerPage.content.length === 1 &&
    //   (!this.section.items || !this.section.items.length)) {
    //   this.edit()
    // }
    if (this.section.index === 0)
      this.edit()
      // setTimeout(() => { this.edit() }, 5000)

    window.addEventListener('scroll', this.checkOnscreen)
    // this.initMenuObserver()
  },
  destroyed () {
    window.removeEventListener('scroll', this.checkOnscreen)

  },
  methods: {
    checkOnscreen () {
      // const sections = this.$el.querySelectorAll('.section-wrapper')
      // sections.forEach(x => observer.observe(x))
      const rect = this.$parent.$el.getBoundingClientRect()

      // console.log('DDDDDDDDDDDDd', this.scrolled, rect, document.documentElement.scrollTop, this.$parent.$el.offsetTop)

      const scrollY = document.documentElement.scrollTop
      const topY = this.$parent.$el.offsetTop
      const bottomY = topY + rect.height - 50
      this.onscreen = scrollY > topY && scrollY < bottomY
      // if (scrollY > topY && scrollY < bottomY) {
      //   // console.log('AAAAAAAAAAAAAa', scrollY, topY, bottomY, this.section.id)
      // }
    },
    // Ensure the menu is stays visible on the viewport while the section is onscreen.
    // initMenuObserver () {
    //   if (!('IntersectionObserver' in window)) return
    //   const observer = new IntersectionObserver((entries, observer) => {
    //     entries.forEach(entry => {
    //       console.log('section onscreen', this.section, entry.intersectionRatio)
    //       this.onscreen = entry.intersectionRatio !== 0
    //     })
    //   })
    //   observer.observe(this.$parent.$el)
    //   // const sectionPos = this.$parent.$el.getBoundingClientRect()
    //   // console.log('SECTION COORDSSSSSSSSSSSSSSs', sectionPos)
    // },
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
      setTimeout(() => { this.$store.commit('setDesignerEditingSection', this.section) }, 500)
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
      // this.designerBackend.savePage(this.designerPage)
      this.designerBackend.saveResource()
      this.exitPreview()
      // this.designerBackend.expandPreview(false)
      // setTimeout(() => { this.$store.commit('setDesignerEditingSection', null) }, 500)
      // this.$store.commit('setDesignerEditingSection', null)
    }
  }
}
</script>

<template lang="pug">
div(:class='wrapperClass' :style='wrapperStyle')
  component(v-if='designerEditingSection' ref='designerControls' :is='elementControlsComponent' :element='element' :meta='meta')
  component(:class='elementClass' :style='elementStyle' :is='elementComponent' :id='element.id' :element='element' :data='elementData')
</template>

<script>
import DesignerInterface from '../../mixins/designer-interface.js'
import { classify, dasherize } from '@/assets/scripts/utils'


export default {
  props: {
    element: {
      type: Object,
      required: true
    },
    meta: {
      type: Object,
      required: true
    }
  },
  mixins: [
    DesignerInterface
  ],
  data () {
    return {
      // editing: false,
      // focused: false,
      // resizing: false,
      offsetWidth: null
    }
  },
  computed: {
    // layoutComponent () {
    //   // console.log('element renderer: layout component', this.element, this.layout)
    //
    //   // NOTE: The `layout` property cannot be accessed from elementData` in a
    //   // computed property or the component will reload each time `set` is
    //   // called on any `elementData` member which will unbind resizing events.
    //   // Passing `layout` in as a prop seems to fix this issue, while still
    //   // allowing the layout to be changed dynamically.
    //   return importThemeLayout(this.$store.state.site.theme_name, this.layout)
    // },
    elementComponent () {
      // return this.importElement(this.element.name)
      const spec = this.$store.getters.designerElementSpec(this.element.name)
      const name = classify(this.element.name) + 'Element'
      // if (this.designerEditingSection && spec && spec.override) {
      //   // if (this.designerBackend && this.designerBackend.importCustomEditorElement) {
      //   //   const element = this.designerBackend.importCustomEditorElement(name)
      //   //   if (element)
      //   //     return element
      //   // }
      //   const component = this.loadCustomComponent(name, 'editor-elements')
      //   if (component)
      //     return component
      //   return () => import(/* webpackChunkName: "designer" */ `../editor-elements/${name}.vue`)
      // } else {
        const component = this.loadCustomComponent(name, 'elements')
        // console.log('COMINATYA', component)
        if (component)
          return component
        // if (this.designerBackend && this.designerBackend.importCustomElement) {
        //   alert('here')
        //   const element = this.designerBackend.importCustomElement(name)
        //   if (element)
        //     return element
        // }
        return () => import(/* webpackChunkName: "designer" */ `../elements/${name}.vue`)
      // }
      // return this.designerEditingSection && spec && spec.override ?
      //   importDesignerElement(this.element.name) :
      //   importThemeElement(this.$store.state.site.theme_name, this.element.name)
    },
    elementControlsComponent () {
      return () => import(/* webpackChunkName: "designer-vendor" */ '../ElementControls.vue')
    },
    elementStyle () {
      const style = {}

      // Calculate minimum height based on aspect ratio
      if (this.elementData.aspect_ratio) { //  && this.offsetWidth

        // Since the root element is lazy loaded the bounding rectangle may not
        // be available straight away, so try to set it here if not already set.
        // if (!this.rect.width) {
        //   this.updateElementWidth()
        // }

        if (!this.offsetWidth) {
          this.updateElementWidth()
        }
        // style.minHeight = (this.offsetWidth / this.elementData.aspect_ratio) + 'px'
        style.height = (this.offsetWidth / this.elementData.aspect_ratio) + 'px'
      }
      // console.log('element renderer: update style', this.element.id, this.offsetWidth, this.elementData.aspect_ratio, style)
      return style
    },
    elementClass () {
      return 'element element-' + dasherize(this.element.name)
    },
    wrapperClass () {
      return 'element-wrapper element-wrapper-' + dasherize(this.element.name)
    },
    wrapperStyle () {
      const style = {}

      if (this.elementData.top_space) {
        style.paddingTop = this.elementData.top_space
      }
      if (this.elementData.bottom_space) {
        style.paddingBottom = this.elementData.bottom_space
      }
      // console.log('element renderer: update wrapper style', this.element.id, style)
      return style
    }
  },
  mounted () {
    if (this.elementData.aspect_ratio) {
      window.addEventListener('resize', this.updateElementWidth)
      this.updateElementWidth()
    }
  },
  beforeDestroy () {
    if (this.elementData.aspect_ratio) {
      window.removeEventListener('resize', this.updateElementWidth)
    }
  },
  methods: {
    updateElementWidth () {
      if (this.$el) {
        this.offsetWidth = this.$el.offsetWidth
        // this.rect = this.$el.getBoundingClientRect()
      }
    }
  }
}
</script>

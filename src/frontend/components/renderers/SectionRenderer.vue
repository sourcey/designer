<template lang="pug">
.section-wrapper(:id='section.id')
  component(v-if='designerEnabled' :is='designerSectionControls' :section='section')
  component.section-layout(:is='layoutComponent' :item='section' :data='section.data')
    items-renderer(v-if='section.items && section.items.length' :item='section')
    .element.element-layout(v-else='')
      .section-empty
        | This section is empty.
        span(v-if='designerEnabled')
          a(href='#' @click='designerBackend.insertPageSection($event, designerPage)')  Edit
          |  and add some elements to get started.
        span(v-if='designerEditingSection')  Add some elements to get started.
</template>

<script>
import ItemsRenderer from './ItemsRenderer.vue'
import DesignerInterface from '../../mixins/designer-interface.js'
// import { classify } from '@/assets/scripts/utils'
import { classify } from '../../../base/utils'

export default {
  name: 'SectionRenderer', // required
  props: {
    section: {
      type: Object,
      required: true
    }
  },
  components: {
    ItemsRenderer
  },
  mixins: [
    DesignerInterface
  ],
  computed: {
    layout () {
      return this.section.data && this.section.data.layout ?
          this.section.data.layout : 'section_default'
    },
    layoutComponent () {
      // return this.importElement(this.element.name)
      // const spec = this.$store.getters.designerElementSpec(this.element.name)
      // const name = classify(this.element.name) + 'Element'
      // if (this.designerEditingSection && spec && spec.override) {
      //   if (this.designerBackend.importCustomEditorElement) {
      //     const element = this.designerBackend.importCustomEditorElement(name)
      //     if (element)
      //       return element
      //   }
      //   return () => import(/* webpackChunkName: "designer" */ `../editor-elements/${name}.vue`)
      // } else {
      const name = classify(this.layout) + 'Layout'
      const component = this.loadCustomComponent(name, 'layouts')
      if (component)
        return component

      return () => import(/* webpackChunkName: "designer" */ `../layouts/${name}.vue`)
    },
    designerSectionControls () {
      return () => import(/* webpackChunkName: "designer-vendor" */ '../SectionControls.vue')
    }
  },
  mounted () {
    // this.$nextTick(() => this.initMenuObserver())
  },
  methods: {
  }
  // watch: {
  //   section: {
  //     handler: (newValue) => {
  //       // this.reload()
  //       console.log('site section renderer: section changed', newValue)
  //     },
  //     deep: true
  //   }
  // },
}
</script>

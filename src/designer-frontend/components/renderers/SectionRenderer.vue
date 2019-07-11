<template>
  <div class="section-wrapper" :id="section.id">
    <component v-if="designerEnabled" :is="designerSectionControls" :section="section" />
    <component class="section-layout" :is="layoutComponent" :item="section" :data="section.data">
      <component v-if="section.items && section.items.length" :is="itemsRenderer" :item="section" />
      <div v-else class="element element-layout">
        <div class="section-empty">
          This section is empty.
          <span v-if="designerEnabled">
            <a href="#" @click="designerBackend.insertPageSection($event, designerPage)">Edit</a> and add some elements to get started.
          </span>
        </div>
      </div>
    </component>
  </div>
</template>

<script>
import DesignerInterface from '../../mixins/designer-interface.js'
import { classify } from '@/assets/scripts/utils'

export default {
  name: 'SectionRenderer', // required
  props: {
    section: {
      type: Object,
      default: () => {}
    }
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
        if (this.designerBackend && this.designerBackend.importCustomLayout) {
          const element = this.designerBackend.importCustomElement(name)
          if (element)
            return element
        }
        return () => import(/* webpackChunkName: "designer" */ `../layouts/${name}.vue`)
      // }
      // return this.designerEditingSection && spec && spec.override ?
      //   importDesignerElement(this.element.name) :
      //   importThemeElement(this.$store.state.site.theme_name, this.element.name)
    },
    designerSectionControls () {
      return () => import(/* webpackChunkName: "designer" */ '../SectionControls.vue')
    }
  },
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

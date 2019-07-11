<template>
  <!-- <div /> -->
  <div v-if='dynamicSections && dynamicSections.length'>
    <!-- {{ page }} -->
    <div
      v-for="(section, index) in dynamicSections"
      :key="index">
      <slot v-if="section.main" />
      <component
        v-else
        :is="sectionRenderer"
        :ref="section.name"
        :id="section.id"
        :section="section" />
    </div>
    <!-- <component
    :is="section.instance"
      v-for="(section, index) in dynamicSections"
      :key="index"
      :is="section.instance"
      :ref="section.name"
      :id="section.id"
      :section="section" /> -->
  </div>
  <div v-else class="main container">
    <div class="section-wrapper section-layout">
      <div class="section section-empty">
        This page is empty.
        <span v-if="designerEnabled">
          <a href="#" @click="designerBackend.insertPageSection($event, page)">Add</a> a new section to get started.
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import DesignerInterface from '../../mixins/designer-interface.js'
// import SectionRenderer from './SectionRenderer.vue'

export default {
  // components: {
  //   SectionRenderer
  // },
  props: {
    page: {
      type: Object,
      required: true
    }
  },
  mixins: [
    DesignerInterface
  ],
  computed: {
    // page () {
    //   return this.page //$store.getters.page
    // },
    dynamicSections () {
      if (!this.page || !this.page.sections)
        return
      return this.page.sections.map((section, index) => {
        // if (!section.id)
        //   throw 'Invalid section data'
        // if (!section.instance)
        //   section.instance = this.sectionRenderer
        section.index = index
        return section
        // if (!section.id)
        //   section.id = randomString(8)
        // this.setSectionDefaults(section) // FIXME
        // if (section.layout) {
        //   const spec = this.$store.getters.designerLayoutSpec(section.layout)
        //   mergeSpecDefaults(section, spec)
        // }
        // return Object.assign({
        //   instance: this.sectionRenderer //(this.$store.state.site.theme_name, section.layout),
        //   // instance: importThemeLayout(this.$store.state.site.theme_name, section.layout),
        // }, section)
      })
    },
    sectionRenderer () {
      return () => import(/* webpackChunkName: "core" */ './SectionRenderer.vue')
      // return this.$store.state.designerEnabled ? //
      //   () => import(/* webpackChunkName: "designer" */ '../renderers/SectionRenderer.vue') :
      //   () => import(/* webpackChunkName: "core" */ '../renderers/SectionRenderer.vue')
    },
  },
  // created () {
  //   this.$store.commit('setDesignerPage', this.page)
  //   // setSite (state, data) {
  //   //   console.log('store: set site', data)
  //   //   state.site = data
  //   // },
  // },
  mounted () {
    this.$emit('ready')
  }
}
</script>

<style lang="scss">

// .overlay {
//   background-position: center;
//   // background-repeat: no-repeat;
//   @include fill-parent;
//
//   &.solid {
//     background-color: rgba(black, .3);
//   }
//
//   &.pattern {
//     background-image: url('../assets/images/overlay-pattern.png');
//   }
// }
</style>

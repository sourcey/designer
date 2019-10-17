<template lang="pug">
//- div {{designerPage}}
div(v-if='dynamicSections && dynamicSections.length' :class='{"designer-active": $store.getters.designerEnabled}')
  div(v-for='(section, index) in dynamicSections' :key='index')
    slot(v-if='section.main')
    section-renderer(v-else :ref='section.name' :id='section.id' :section='section')
.main.container(v-else)
  .section-wrapper.section-layout
    .section.section-empty
      | This page is empty.
      span(v-if='designerEnabled')
        a(href='#' @click='designerBackend.insertPageSection($event, designerPage)') Add
        |  a new section to get started.
</template>

<script>
import DesignerInterface from '../../mixins/designer-interface.js'
import SectionRenderer from './SectionRenderer.vue'
import IpcClient from '../../assets/scripts/ipc-client.js'

export default {
  components: {
    SectionRenderer
  },
  // props: {
  //   page: {
  //     type: Object,
  //     required: true
  //   }
  // },
  mixins: [
    DesignerInterface
  ],
  computed: {
    // page () {
    //   return this.$store.getters.designerPage
    // },
    dynamicSections () {
      // console.log('^^^^^^^^^^^^^^^^^^ get synamic sections', this.designerPage)
      if (!this.designerPage || !this.designerPage.content)
        return
      return this.designerPage.content.map((section, index) => {
        section.index = index
        return section
      })
    }
  },
  mounted () {
    // if (this.designerEnabled) {
      IpcClient.registerApp(this.$root)
      // this.initMenuObserver()
    // }

    // this.$nextTick(() => this.initMenuObserver())
    // setTimeout(() => this.initMenuObserver(), 1000)
    this.$emit('ready')
  },
  destroyed () {
    if (this.designerEnabled) {
      IpcClient.unregisterApp(this.$root)
    }
  },
  methods: {

    // Ensure the menu is stays visible on the viewport while the section is onscreen.
    // initMenuObserver () {
    //   if (!('IntersectionObserver' in window)) return
    //
    //   let topSection = false, nextOnscreenSection = false
    //   const observer = new IntersectionObserver((entries, observer) => {
    //     entries.forEach(entry => {
    //       console.log('page section onscreen observer', entry.target.id, entry.isIntersecting, entry)
    //
    //       // When a new element scrolls into view it will be marked as onscreen
    //       // when the previous element scrolls out of view
    //
    //       if (entry.isIntersecting) {
    //
    //         if (nextOnscreenSection) {
    //           nextOnscreenSection.classList.remove('onscreen')
    //           console.log('offscreen', nextOnscreenSection.id)
    //         }
    //
    //         // Mark the top element as onscreen when loaded
    //         if (topSection === false) {
    //           topSection = entry.target
    //           topSection.classList.add('onscreen')
    //           console.log('top section onscreen', topSection.id)
    //         }
    //         // else {
    //         //   console.log('onscreen cause null', entry.target.id)
    //         //   entry.target.classList.add('onscreen')
    //         // }
    //         nextOnscreenSection = entry.target
    //       }
    //       else {
    //         // if (nextOnscreenSection) {
    //           nextOnscreenSection.classList.add('onscreen')
    //           console.log('onscreen', nextOnscreenSection.id)
    //           // nextOnscreenSection = null
    //         // }
    //
    //         // if (topSection && topSection != entry.target) {
    //         //   topSection.classList.remove('onscreen')
    //         //   console.log('top section offscreen', topSection.id, entry.target)
    //         // }
    //       }
    //     })
    //   }, {
    //     rootMargin: '-50px',
    //     threshold: 0
    //   })
    //
    //   const sections = this.$el.querySelectorAll('.section-wrapper')
    //   sections.forEach(x => observer.observe(x))
    // },
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

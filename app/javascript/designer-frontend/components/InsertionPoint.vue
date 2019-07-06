<template lang="pug">
  span.designer-insertion-point(:class="[position, {'show': show}]" @click="createElement($event, 'top')")
</template>

<script>
import DesignerInterface from '../mixins/designer-interface.js'
import SpecTools from '../assets/scripts/spec-tools.js'

export default {
  props: {
    position: {
      type: String,
      default: null
    },
    meta: {
      type: Object,
      // default: () => {}
    }
  },
  mixins: [
    DesignerInterface
  ],
  data () {
    return {
      show: false
    }
  },
  mounted () {
    this.sectionElement.addEventListener('mousemove', this.onSectionMouseMove)
  },
  beforeDestroy() {
    this.sectionElement.removeEventListener('mousemove', this.onSectionMouseMove)
  },
  computed: {
    sectionElement () {
      return this.parentComponent('SectionRenderer').$el
    }
  },
  methods: {
    onSectionMouseMove (event) {
      const rect = this.$el.getBoundingClientRect(),
        yTop = Math.abs(event.clientY - rect.top),
        yBottom = Math.abs(event.clientY - rect.bottom) // - (rect.top + rect.height))

      if (yTop < 30) {
        this.show = 'top'
      } else if (yBottom < 30) {
        this.show = 'bottom'
      } else {
        this.show = false
      }
    },
    createElement (event) {
      console.log('element: createElement', event)
      this.designerBackend.createElement(event, (element) => {
        if (this.position === 'top') {
          SpecTools.insertElementTop(element, this.meta)
        } else {
          SpecTools.insertElementBottom(element, this.meta)
        }
        // this.section.items = [...this.section.items]
        // this.$parent.$forceUpdate()
      })
    }
  }
}
</script>

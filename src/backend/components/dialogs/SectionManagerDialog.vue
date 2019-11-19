<template lang="pug">
dialog-window(
    title="Editing Page Sections"
    :options='options'
    v-on='$listeners')
  slot
    draggable(:options="{handle:'.drag-page-handle'}" element='section' v-model='page.sections')
      .item-handle(
          v-for='(section, index) in page.sections'
          :key='index')
        //- a.title(@click.prevent='toggleForm' href='#' title='Edit this page') {{ section.label }}
        .title {{ section.label }}
        .actions
          button.btn.btn-icon.btn-text-secondary(@click.prevent='removePageSection(index)')
          //- button.btn.btn-icon.btn-text-secondary(@click.prevent='page.sections.splice(index, 1)')
            i.fas.fa-trash
          button.drag-handle.drag-page-handle.btn.btn-icon.btn-text-secondary(@click.prevent)
            icon(name='move-v')
      .item-handle
        //- (@click='createPageSection(page)')
        a.title(@click.prevent='createPageSection' href='#')
          i.fas.fa-plus
          span.ml-05 Add section
  .dialog-footer(slot='footer')
    button.btn.btn-block.dialog-btn(@click.prevent='$emit("close")') Close
</template>

<script>
import DialogWindow from '../DialogWindow'
import Draggable from 'vuedraggable'
import { mergeSpecDefaults } from '../../../base/utils'


export default {
  name: 'section-manager-dialog',
  components: {
    DialogWindow,
    Draggable
  },
  props: {
    page: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  // // mixins: [ Forms ],
  methods: {
    createPageSection (event) {
      console.log('createPageSection')

      // Select a layout and create the section
      // The $parent must be the Designer page
      this.$parent.selectTemplateDialog(event, (layout) => {
        const spec = this.designerBackendStore.getters.getLayoutSpec(layout)
        const section = {
          label: 'New Section',
          items: [],
          data: {
            layout: layout
          }
        }

        // Merge spec defaults into element data
        mergeSpecDefaults(section, spec)
        this.page.sections.push(section)

        // Force reactivity
        this.page.sections = [...this.page.sections]
      })
    },

    removePageSection (index) {
      this.page.sections.splice(index, 1)

      // Force reactivity
      this.page.sections = [...this.page.sections]

      console.log('removePageSection', this.page.sections)
    },
  }
}
</script>

<style scoped lang="scss">
</style>

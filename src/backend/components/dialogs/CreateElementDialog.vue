<template lang="pug">
dialog-window(
    title='Create new Element'
    :options='options'
    v-on='$listeners')
  slot
    //- div {{elementsSortedByCategory}}
    //- div {{this.designerBackendState.spec.elements}}
    section(v-for='(elements, category) in elementsSortedByCategory' :key='category')
      header.mt-0.mb-0
        h2.form-title {{ category }}
      //- .p-1.clearfix
      .row.no-gutters.pt-05.pb-1
        //- .p-1
        //- a.icon-select.w-25(.d-block
        a.dialog-icon-button.col-4.px-075.pt-05(
            v-for='(element, index) in elements'
            :key='index'
            href='#'
            @click.prevent='createElement(element.name)')
          span.d-block.p-05
            icon(:name='"designer-" + element.icon' size='24')
            .label {{ element.label }}
  .dialog-footer(slot='footer')
    button.btn.btn-black.btn-block.dialog-btn(@click.prevent='$emit("close")') Close
</template>

<script>
import DialogWindow from '../DialogWindow'
import { sortItemsBy } from '../../../base/utils'


export default {
  name: 'create-element-dialog',
  components: {
    DialogWindow
  },
  props: {
    options: {
      type: Object,
      // default: () => {}
    },
    resource: {
      type: Object,
    },
  },
  computed: {
    elementsSortedByCategory () {
      return sortItemsBy(this.designerBackendState.spec.elements, 'category')
    }
  },
  methods: {
    createElement (name) {
      const element = this.$store.getters.designerBackendInterface.createResourceElement(this.resource, name)
      console.log('create element dialog: create element', element)

      this.$emit('apply', element)
    }
  }
}
</script>

<style scoped lang="scss">

</style>

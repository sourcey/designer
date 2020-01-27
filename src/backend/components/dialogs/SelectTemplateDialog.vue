<template lang="pug">
dialog-window(
    title='Starting Template'
    :options='options'
    v-on='$listeners')
  slot

    //-   //- div {{elementsSortedByCategory}}
    //-   //- div {{this.designerBackendState.spec.elements}}
    //-   section(v-for='(elements, category) in elementsSortedByCategory' :key='category')
    //-     header.mt-0.mb-0
    //-       h2.form-title {{ category }}
    //-     //- .p-1.clearfix
    //-     .row.no-gutters.pt-05.pb-1
    //-       //- .p-1
    //-       //- a.icon-select.w-25(.d-block
    //-       a.dialog-icon-button.col-4.px-075.pt-05(
    //-           v-for='(element, index) in elements'
    //-           :key='index'
    //-           href='#'
    //-           @click.prevent='createElement(element.name)')
    //-         span.d-block.p-05
    //-           icon(:name='"designer-" + element.icon' size='24')
    //-           .label {{ element.label }}
    //- .dialog-footer(slot='footer')
    //-   button.btn.btn-black.btn-block.dialog-btn(@click.prevent='$emit("close")') Close

    section
      //- .p-1.clearfix
      .row.no-gutters
        //- .pt-05.pb-1
        a.dialog-icon-button.col-4.px-075.pb-05(
            v-for='(template, name) in designerBackendState.spec.templates' :key='name'
            href='#'
            @click.prevent='selectTemplateDialog(name)')
          span.d-block.p-05
            icon(:name='"designer-template-" + template.icon' size='32')
            .label {{ template.label }}
  .dialog-footer(slot='footer')
    button.btn.btn-block.dialog-btn(@click.prevent='$emit("close")') Close
</template>

<script>
import DialogWindow from '../DialogWindow'


export default {
  name: 'select-template-dialog',
  components: {
    DialogWindow
  },
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  // computed: {
  //   templatesSortedByCategory () {
  //     return sortItemsBy(this.designerBackendState.templates, 'category')
  //   }
  // },
  methods: {
    selectTemplateDialog (name) {
      // const template = this.designerBackendStore.selectTemplateDialogData(name)
      // const template = this.designerBackendStore.selectTemplateDialogData(name)
      // this.designerBackendStore.mergeSpecDefaults(this.section, this.templateSpec)
      // console.log('create template dialog: create template', template)

      // this.$emit('update', template)
      this.$emit('apply', name)
      // this.close
    }
  }
}
</script>

<style scoped lang="scss">
.icon-select {
  width: 33%;
  //
  // .icon {
  //   height: 32px !important;
  // }
}
</style>

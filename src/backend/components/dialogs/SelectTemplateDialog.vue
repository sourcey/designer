<template lang="pug">
dialog-window(
    title='Starting Template'
    :options='options'
    v-on='$listeners')
  slot
    section.p-1.clearfix
      a.icon-select(
          v-for='(template, name) in designerBackendState.spec.templates' :key='name'
          href='#'
          @click.prevent='selectTemplateDialog(name)')
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

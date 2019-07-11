<template lang="pug">
dialog-window(
    title='Starting Template'
    :options='options'
    v-on='$listeners')
  slot
    section.p-1.clearfix
      a.icon-select(
          v-for='(template, name) in designerState.spec.templates' :key='name'
          href='#'
          @click.prevent='selectTemplate(name)')
        icon(:name='"template-" + template.icon' size='32')
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
  //     return sortItemsBy(this.designerState.templates, 'category')
  //   }
  // },
  methods: {
    selectTemplate (name) {
      // const template = this.designerStore.selectTemplateData(name)
      // const template = this.designerStore.selectTemplateData(name)
      // this.designerStore.mergeSpecDefaults(this.section, this.templateSpec)
      // console.log('create template dialog: create template', template)

      // this.$emit('update', template)
      this.$emit('select', name)
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

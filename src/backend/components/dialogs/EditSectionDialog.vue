<template lang="pug">
dialog-window(
    :title="'Editing ' + (section.data.label || section.label)"
    :options='options'
    @close='cancel'
    v-on='$listeners')
  slot
    //- v-if='renderForm'
    form-section.py-05(v-if='renderForm' :spec='layoutSpec' :object='section' :root='section' @update='emitUpdate')
      text-input(slot='start' :object='section.data' name='label' :spec='sectionLabelSpec' @input='e => emitUpdate("label", e)')

  .dialog-footer(slot='footer')
    button.btn.w-50.dialog-btn.btn-cancel(@click.prevent='$emit("close")') Cancel
    button.btn.w-50.dialog-btn.btn-apply(@click.prevent='$emit("apply")') Apply
</template>

<script>
import DialogWindow from '../DialogWindow'
import FormSection from '../FormSection.vue'
import TextInput from '../inputs/TextInput.vue'
import { mergeSpecDefaults, randomString, clone } from '../../../base/utils'
import IpcServer from '../../ipc-server'

export default {
  name: 'edit-section-dialog',
  components: {
    DialogWindow,
    FormSection,
    TextInput
    // StandardInput
  },
  props: {
    // section: {
    //   type: Object,
    //   default: () => {}
    // },
    options: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      renderForm: true,
      layout: 'section_default' // this.section.data.layout
      // sectionCloned: JSON.parse(JSON.stringify(this.section))
    }
  },
  computed: {
    sectionLabelSpec () {
      return {
        label: 'Label',
        default: this.section.label
      }
    },
    // designerPreviewStore () {
    //   return this.$store.getters.previewApp.$store
    // },
    section () {
      // NOTE: Some strange reactivity bugs occur when modifying the data from
      // across the iframe boundary.
      // In short, objects from the other side cannot be assigned as propData
      // for components of the current instance or watchers on the other side
      // will cease to function.
      // This also means computed data will not update on this side unless the
      // object is passed as propData hence the best solution is just to clone
      // everything and update properties via the IPC service.
      return clone(this.designerPreviewStore.getters.designerEditingSection)
    },
    sectionCloned () {
      return clone(this.section)
    },
    layoutSpec () {
      // if (this.layout) //section.data.layout)
      return this.designerBackendStore.getters.getLayoutSpec(this.layout || 'section_default') //.section.data.layout)
    }
  },
  created () {
    this.layout = this.section.data.layout

    // IpcServer.postPreviewMessage('updateSectionProperty', {
    //   // pageId: this.item.id,
    //   name: 'image',
    //   value: 'GRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR'
    // })

    // console.log('APP: section dialog: CREATE', this.section.__ob__.dep.id, this.section.__ob__.dep.subs.length)
  },
  methods: {
    // refreshForm () {
    //   this.renderForm = false
    //   this.$nextTick(() => this.renderForm = true)
    // },
    emitUpdate (name, value) {
      console.log('edit section dialog: on update', name, value)

      if (name === 'layout') {
        this.layout = value
        mergeSpecDefaults(this.section, this.layoutSpec)
        // this.refreshForm()
      }

      IpcServer.postPreviewMessage('updateSectionProperty', {
        // pageId: this.item.id,
        name: name,
        value: value
      })
    },
    cancel () {
      console.log('edit section dialog: cancel')
      Object.keys(this.sectionCloned).forEach(key => {
        this.$set(this.section, key, this.sectionCloned[key])
      })
      this.$emit('close')
    }
  },
  // watch: {
  //   'section.data': {
  //     handler: function (newValue) {
  //   //     // this.reload()
  //       console.log('APP: section renderer: SECTION CHANGE ID', this.section.__ob__.dep.id)
  //   //     console.log('ZZZZ', this.$store.getters.previewApp.$store.getters.designerEditingSection)
  //   //     this.$store.getters.previewApp.$store.getters.designerEditingSection.$forceUpdate()
  //   //
  //   //     // newValue.data = JSON.parse(JSON.stringify(newValue.data))
  //   //     // { ...newValue.data }
  //   //     // newValue.data = newValue.data
  //   //     // this.$set(this.section.data, 'image', { url: randomString(5) })
  //   //     // Vue.set(newValue, 'image', { url: randomString(5) })
  //   //
  //   //     // this.$set(this.section, 'data', { ...newValue })
  //   //     // newValue = { ...newValue }
  //     },
  //     deep: true
  //   },
  //   'section.data.layout': function (newVal, oldVal) {
  //     mergeSpecDefaults(this.section, this.layoutSpec)
  //     this.refreshForm()
  //
  //     console.log('edit section dialog: layout changed', this.section.data, this.section.data.image)
  //     // this.$set(this.section.data, 'image', {})
  //   }
  // }
}
</script>

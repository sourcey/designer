<template lang="pug">
dialog-window(
    :title="'Editing ' + (element.label || elementSpec.label)"
    :options='options'
    v-on='$listeners')
  slot
    form-section.py-05(:spec='elementSpec' :object='element' :root='element' @update='emitUpdate')
  .dialog-footer(slot='footer')
    button.btn.w-50.dialog-btn.btn-cancel(@click.prevent='$emit("close")') Cancel
    button.btn.w-50.dialog-btn.btn-apply(@click.prevent='$emit("apply")') Apply
</template>

<script>
import DialogWindow from '../DialogWindow'
import FormSection from '../FormSection'
import IpcServer from '../../ipc-server'

export default {
  name: 'edit-element-dialog',
  components: {
    DialogWindow,
    FormSection
  },
  data () {
    return {
      // restoreState: JSON.parse(JSON.stringify(this.element))
    }
  },
  props: {
    // element: {
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
      // restoreState: JSON.parse(JSON.stringify(this.element))
    }
  },
  computed: {
    // previewStore () {
    //   return this.$store.getters.previewApp.$store
    // },
    element () {
      // NOTE: Some strange reactivity bugs occur when modifying the data from
      // across the iframe boundary.
      // In short, objects from the other side cannot be assigned as propData
      // for components of the current instance or watchers on the other side
      // will cease to function.
      // This also means computed data will not update on this side unless the
      // object is passed as propData hence the best solution is just to clone
      // everything and update properties via the IPC service.
      console.log(this.previewStore.getters.designerEditingElement)
      return JSON.parse(JSON.stringify(this.previewStore.getters.designerEditingElement.element))
    },
    restoreState () {
      return JSON.parse(JSON.stringify(this.element))
    },
    elementSpec () {
      return this.designerStore.getElementSpec(this.element.name)
    }
  },
  methods: {
    emitUpdate (name, value) {
      console.log('edit element dialog: on update', name, value)

      // if (name === 'layout') {
      //   this.layout = value
      //   mergeSpecDefaults(this.section, this.layoutSpec)
      // }

      IpcServer.postPreviewMessage('updateElementProperty', {
        // pageId: this.item.id,
        name: name,
        value: value
      })
    },
    cancel () {
      console.log('edit element dialog: cancel')
      Object.keys(this.restoreState).forEach(key => {
        this.$set(this.element, key, this.restoreState[key])
      })

      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
</style>

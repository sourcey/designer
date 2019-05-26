<template lang="pug">
.item-wrap.color-input
  .form-group.form-row.align-items-center
    label.form-label.col-10.col-form-label(:for="'input-' + name") {{ inputLabel }}
    //- .col
      input.form-control(type='text', :value='object', @focusin="emitSelect", @change="$emit('update', name, object = $event.target.value)")
      // v-model="object[name]"
    .col
      //- verte(display='picker')v-if='isShown'
      verte(
          ref='verte'
          model='hex'
          display='picker'
          picker='square'
          menuPosition='right'
          :value='object'
          :enableAlpha='false'
          @input='onPickerChange')
        // :recentColors="null"
        svg
          rect(width='100%', height='100%')
</template>

<script>
import Input from '../../mixins/input'
import Verte from 'verte'

export default {
  extends: Input,
  // props: ['spec', 'name', 'item', 'parent', 'root'],
  components: { Verte },
  data() {
    return {
      loaded: false,
      object: this.item && this.item[this.name] ?
        this.item[this.name] :
        this.$set(this.item, this.name, '') // make it reactive
        // this.spec.default
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.loaded = true

      // HACK: As verte starts hidden the canvas rect is not calculated
      this.unwatch = this.$refs.verte.$watch('isMenuActive', (value) => {
        if (value !== true) return
        const picker = this.$refs.verte.$children[0]
        picker.pickerRect = picker.$refs.canvas.getBoundingClientRect()
        picker.updateSquareColors()
        picker.handleValue(this.object)
      })
    })
  },
  beforeDestroy () {
    if (this.unwatch)
      this.unwatch()
  },
  methods: {
    onPickerChange (value) {
      if (!this.loaded)
        return // drop early events

      console.log('color input: picker changed', name, value)
      // this.object[this.name] = value
      this.object = value
      this.$emit('update', this.name, value)
    }
  }
}
</script>

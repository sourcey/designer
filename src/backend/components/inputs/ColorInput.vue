<template lang="pug">
.item-wrap.designer-color-input
  //- div {{ value }}
  .form-group.form-row.align-items-center
    a.input-reset(v-if='!isDefaultValue' @click.prevent='setDefaultValue' href='#') x
    label.control-label.col-10.col-form-label(:for='inputId') {{ inputLabel }}
    //- .col
      input.form-control(type='text', :value='object', @focusin='emitSelect', @change="$emit('update', name, object = $event.target.value)")
      // v-model="object[name]"
    .col
      //- verte(
          ref='verte'
          model='hex'
          display='picker'
          picker='square'
          menuPosition='right'
          :value='value'
          :enableAlpha='false'
          @input='onPickerChange')
      verte(
          ref='verte'
          model='rgb'
          display='picker'
          picker='square'
          menuPosition='right'
          :value='value'
          :enableAlpha='true'
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
  components: { Verte },
  data () {
    return {
      loaded: false
    }
  },
  mounted () {
    console.log('color input: ', this.parent, this.object, this.name)

    this.$nextTick(() => {
      this.loaded = true

      // HACK: As verte starts hidden the canvas rect is not calculated
      this.unwatch = this.$refs.verte.$watch('isMenuActive', (value) => {
        if (value !== true) return
        const picker = this.$refs.verte.$children[0]
        picker.pickerRect = picker.$refs.canvas.getBoundingClientRect()
        picker.updateSquareColors()
        picker.handleValue(this.value)
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
      this.value = value
      this.emitUpdate()
    }
  }
}
</script>

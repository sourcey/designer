<template lang="pug">
.item-wrap.color-input
  //
    <br>name: >>>
    <br>{{name}}
    <br>spec: >>>
    <br>{{spec}}
    <br>object: >>>
    <br>{{object}}
  //
    <div class="form-group image-array-input">
    <label :for="'input-' + name">{{ itemLabel(name, spec) }}</label>
    <Verte model="rgb" display="picker" picker="square" :value="object[name]" :recentColors="null" :enableAlpha=false @input="onPickerChange">
    <span class="form-control">
    <svg>
    <rect width="100%" height="100%" />
    </svg>
    </span>
    </Verte>
    </div>
  // align-items-center
  .form-group.form-row.align-items-center
    label.form-label.col-xl-5.col-form-label(:for="'input-' + name") {{ itemLabel(name, spec) }}
    //- .col
      input.form-control(type='text', :value='object', @focusin="$emit('select', name)", @change="$emit('update', name, object = $event.target.value)")
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
import Verte from 'verte';

export default {
  props: ['spec', 'name', 'item', 'parent', 'root'],
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
  mounted() {
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

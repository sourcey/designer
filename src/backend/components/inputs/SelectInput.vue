<template lang="pug">
.item-wrap.designer-select-input
  .form-group
    a.input-reset(v-if='!isDefaultValue' @click.prevent='setDefaultValue' href='#') x
    label.control-label(v-if='label !== false' :for="inputId" v-b-tooltip :title='hint') {{ inputLabel }}
    select.form-control(:id='inputId'
        v-model='currentValue'
        :name='field || name'
        :class="{'is-invalid': errorMessage}"
        @focusin='emitSelect')
      //- @change='emitUpdate'
      option(v-if='!required' value='' :selected='!value') {{ placeholder || 'Select an option' }}
      //- option(v-for='(value, index) in options'
      //-     :value='Array.isArray(value) ? value[1] : value'
      //-     :disabled='value[2] && value[2].disabled'
      //-     :selected='optionIsSelected(value[0])') {{ Array.isArray(value) ? value[0] : value }}
      option(v-for='(value, key) in options'
          :disabled='optionDisabled(value)'
          :selected='optionSelected(value)'
          :value='typeof(key) === "string" ? key : optionValue(value)') {{ optionLabel(value) }}
    .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
</template>

<script>
import Input from '../../mixins/input'
import { isObject } from '../../../base/utils'

export default {
  extends: Input,
  props: {
    options: {
      type: [Object,Array]
    }
  },
  computed: {
    displayValue () {
      return isObject(this.options) ? this.options[this.value] : this.value
    },
  },
  methods: {
    optionValue (value) {
      return isObject(value) && value.value ? value.value : value
    },
    optionLabel (value) {
      return isObject(value) && value.label ? value.label : value
    },
    optionDisabled (value) {
      return isObject(value) && value.disabled
    },
    optionSelected (value) {
      return this.optionValue(value) === this.value
    },
  }
}
</script>

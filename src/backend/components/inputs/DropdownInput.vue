<template lang="pug">
.item-wrap.designer-dropdown-input
  .form-group
    a.input-reset(v-if='!isDefaultValue' @click.prevent='setDefaultValue' href='#') x
    //- div {{ name }}
    //- div {{ value }}
    //- div {{ currentValue }}
    //- div {{ displayValue }}
    label.dropdown-label(:for='inputId' v-b-tooltip.hover :title='tooltip')
      .dropdown-label-text
        | {{ inputLabel }}
        span(v-if='displayValue') : {{ displayValue }}
      icon(name='caret-down' size='16')
    //- .form-control
    select(:id='inputId'
        v-model='currentValue'
        :name='field || name'
        :class="[inputClass, {'is-invalid': errorMessage}]"
        @focusin='emitSelect'
        @change='emitUpdate')
      option(v-if='!required' value='') {{ placeholder || 'Select an option' }}
      option(v-for='(label, key) in options' :value='typeof(key) === "string" ? key : label') {{ label }}
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
      return isObject(this.options) ? this.options[this.currentValue] : this.currentValue
    },
  },
  // created () {
  //   // Must be an array or Vue will complain
  //   if (this.multiple && !Array.isArray(this.currentValue)) {
  //     this.currentValue = []
  //   }
  // }
}
</script>

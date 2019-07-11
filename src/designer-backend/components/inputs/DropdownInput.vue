<template lang="pug">
.item-wrap.designer-dropdown-input
  .form-group
    a.input-reset(v-if='!isDefaultValue' @click.prevent='setDefaultValue' href='#') x
    //- div {{ name}}
    //- div {{ value}}
    //- div {{ spec}}
    label.dropdown-label(:for='inputId' v-b-tooltip :title='spec.hint')
      .dropdown-label-text
        | {{ inputLabel }}
        span(v-if='displayValue') : {{ displayValue }}
      icon(name='caret-down' size='16')
    //- .form-control
    select(:id='inputId'
        v-model='value'
        :name='spec.field || spec.name'
        :class="{'is-invalid': errorMessage}"
        @focusin='emitSelect'
        @change='emitUpdate')
      option(v-if='!spec.required' value='') {{ spec.placeholder || 'Select an option' }}
      option(v-for='(label, key) in spec.options' :value='typeof(key) === "string" ? key : label') {{ label }}
    .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
</template>

<script>
import Input from '../../mixins/input'
import { isObject } from '../../../designer/utils'

export default {
  extends: Input,
  computed: {
    displayValue () {
      return isObject(this.spec.options) ? this.spec.options[this.value] : this.value
    },
  },
  // created () {
  //   // Must be an array or Vue will complain
  //   if (this.spec.multiple && !Array.isArray(this.value)) {
  //     this.value = []
  //   }
  // }
}
</script>

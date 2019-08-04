<template lang="pug">
.item-wrap.designer-select-input
  .form-group
    a.input-reset(v-if='!isDefaultValue' @click.prevent='setDefaultValue' href='#') x
    label.control-label(v-if='spec.label !== false' :for="'input-' + id" v-b-tooltip :title='spec.hint') {{ itemLabel }}
    select(:id='inputId'
        v-model='currentValue'
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
import { isObject } from '../../../base/utils'

export default {
  extends: Input,
  computed: {
    displayValue () {
      return isObject(this.spec.options) ? this.spec.options[this.value] : this.value
    },
  }
}
</script>

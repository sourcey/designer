<template lang="pug">
.item-wrap.select-input
  .form-group
    //- div {{ name}}
    //- div {{ value}}
    //- div {{ spec}}
    label.dropdown-label(:for="inputId" v-b-tooltip :title='spec.hint')
      .dropdown-label-text
        | {{ inputLabel }}
        span(v-if="value") : {{ displayValue }}
      icon(name='caret-down' size='16')
    //- .form-control
    select(:id="inputId"
        v-model='value'
        :class="{'is-invalid': errorMessage}"
        @focusin="emitSelect"
        @change="emitUpdate")
      option(v-if='!spec.required' value='') Select an option
      option(v-for='(val, index) in spec.enum' :value='itemValue(val)') {{ itemLabel(val) }}
    .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
</template>

<script>
import Input from '../../mixins/input'
import { isObject } from '../../utils'

export default {
  extends: Input,
  computed: {
    displayValue () {
      const value = this.item[this.name]
      if (this.spec.enum) {
        for (let index in this.spec.enum) {
          const option = this.spec.enum[index]
          if (value === index)
            return value
          else if (option[value])
            return option[value]
        }
      }
      return value
    },
  },
  methods: {
    itemValue (item) {
      return isObject(item) ? Object.keys(item)[0] : item
    },
    itemLabel (item) {
      return isObject(item) ? Object.keys(item)[1] : item
    }
  }
}
</script>

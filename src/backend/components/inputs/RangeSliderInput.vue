<template lang="pug">
.item-wrap.designer-range-input
  .form-group
    //- div {{ value }}
    a.input-reset(v-if='!isDefaultValue' @click.prevent='setDefaultValue' href='#') x
    .d-flex
      .designer-range-input-wrap
        label.flex-fill(:for='inputId' v-b-tooltip.hover :title='tooltip') {{ inputLabel }}
        input(type='range'
            v-model.number='decimalValue'
            :min='min'
            :max='max'
            :step='step || 1'
            @input='emitUpdate')
      input.transparent(type='text'
          :value='value'
          :name='field || name'
          :placeholder='placeholder'
          @focusin='emitSelect(); enableEvents = false'
          @input='emitUpdate'
          @blur='enableEvents = true; value = $event.target.value')
    .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
</template>

<script>
import Input from '../../mixins/input'
import { sanitizeDecimal } from '../../../base/utils'


export default {
  extends: Input,
  computed: {
    decimalValue: {
      get: function () {
        // console.log('GET DECIMAL VAL', this.currentValue, sanitizeDecimal(this.currentValue))
        return sanitizeDecimal(this.currentValue)
      },
      set: function (newValue) {
        // console.log('SET DECIMAL VAL', newValue)
        this.currentValue = newValue // sanitizeDecimal(newValue)
      }
    }
  },
  methods: {
    formatValue (rawValue) {
      const decimal = sanitizeDecimal(rawValue)

      // While events are enabled (ie. the text input is not focused) we can
      // mask the value on input
      if (this.enableEvents && this.unit) {
        return decimal + this.unit
      } else {
        return decimal
      }
    },
    // console.log('set DESIMAL value', this.model, this.name, newValue)
    // console.log('FORMAT', this.enableEvents, rawValue, decimal)
    // updateValue () {
    //   console.log('BLURRRRRRRRRRRR', this.enableEvents)
    //   this.currentValue = this.currentValue
    // }
    // parseValue (value) {
    //   if (this.format === 'currency' || this.format === 'decimal')
    //     return sanitizeDecimal(value)
    //   return value
    // },
    // formatValue (value) {
    //   if (!value)
    //     return
    //   // console.log('formatValue', value)
    //   if (this.format === 'currency')
    //     return this.formatMoney(sanitizeDecimal(value))
    //   else if (this.format === 'decimal')
    //     return this.formatDecimal(sanitizeDecimal(value))
    //   else
    //     return value
    // }
  }
}
</script>

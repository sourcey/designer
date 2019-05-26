<template lang="pug">
.item-wrap.range-input
  .form-group
    .d-flex
      .range-input-wrap
        label.flex-fill(:for="inputId" v-b-tooltip :title='spec.hint') {{ inputLabel }}
        input(type='range'
            v-model.number='value'
            :min='spec.min'
            :max='spec.max'
            @input="emitUpdate")
      input.transparent(type='text'
          v-model.number='value'
          :placeholder='spec.placeholder'
          @focusin="emitSelect"
          @input="emitUpdate")
    .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
</template>

<script>
import Input from '../../mixins/input'

export default {
  extends: Input
}
</script>

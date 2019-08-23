<template lang="pug">
.item-wrap.checkbox-input
  .form-group
    .d-flex.align-items-center
      label.flex-fill(v-if='label !== false' :for='inputId' v-b-tooltip :title='hint') {{ inputLabel }}
      .custom-control.custom-checkbox
        input.custom-control-input(
            type='checkbox'
            v-model='currentValue'
            :id='inputId'
            @change='emitUpdate')
        label.custom-control-label(:for='inputId')
    .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
</template>

<script>
import Input from '../../mixins/input'

export default {
  extends: Input
}
</script>

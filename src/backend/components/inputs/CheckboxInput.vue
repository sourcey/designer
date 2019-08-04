<template lang="pug">
.item-wrap.checkbox-input
  .form-group
    //- Left aligned checkbox
    .custom-control.custom-checkbox(v-if='spec.align === "left"')
      input.custom-control-input(
          type='checkbox'
          v-model='currentValue'
          :id='inputId'
          @change='emitUpdate')
      label.custom-control-label(:for='inputId' v-b-tooltip :title='spec.hint') {{ inputLabel }}
    //- Right aligned checkbox
    .d-flex.align-items-center(v-else)
      label.flex-fill(v-if='spec.label !== false' :for='inputId' v-b-tooltip :title='spec.hint') {{ inputLabel }}
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

<template lang="pug">
.item-wrap.checkbox-input
  .form-group
    //- Left aligned checkbox
    .custom-control.custom-checkbox(v-if='align === "left"')
      input.custom-control-input(
          type='checkbox'
          v-model='currentValue'
          :name='field || name'
          :id='inputId')
      //- @change='emitUpdate'
      label.custom-control-label(:for='inputId' v-b-tooltip :title='tooltip') {{ inputLabel }}
    //- Right aligned checkbox
    .d-flex.align-items-center(v-else)
      label.flex-fill(v-if='label !== false' :for='inputId' v-b-tooltip :title='tooltip') {{ inputLabel }}
      .custom-control.custom-checkbox
        input.custom-control-input(
            type='checkbox'
            v-model='currentValue'
            :name='field || name'
            :id='inputId')
        //- @change='emitUpdate'
        label.custom-control-label(:for='inputId')
    .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
    .hint.mt-075(v-if='hint' v-html='hint')
</template>

<script>
import Input from '../../mixins/input'

export default {
  extends: Input,
  props: {
    align: {
      type: String
    }
  }
}
</script>

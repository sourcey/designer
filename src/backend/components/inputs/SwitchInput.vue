<template lang="pug">
.item-wrap.checkbox-input
  .form-group
    .d-flex.align-items-center
      //- div {{value}}
      //- div {{currentValue}}
      //- div {{typeof(currentValue)}}
      label.flex-fill(v-if='label !== false' :for='inputId' v-b-tooltip.hover :title='tooltip') {{ inputLabel }}
      .custom-control.custom-switch
        input.custom-control-input(
            type='checkbox'
            v-model='currentValue'
            :name='field || name'
            :id='inputId')
        //- :checked='currentValue === true'
        //- v-model='currentValue'
        //- @change='emitUpdate'
        label.custom-control-label(:for='inputId')
    .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
    .hint.mt-05(v-if='hint' v-html='hint')
</template>

<script>
import Input from '../../mixins/input'

export default {
  extends: Input
}
</script>

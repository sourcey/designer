<template lang="pug">
.item-wrap.textarea-input
  .form-group
    label.control-label(v-if='label !== false' :for='inputId' v-b-tooltip.hover :title='tooltip') {{ inputLabel }}
    p.hint(v-if='hint' v-html='hint')
    textarea(:id='inputId'
        v-model='currentValue'
        :name='field || name'
        :rows='rows'
        :placeholder='placeholder'
        :class="[inputClass, {'is-invalid': errorMessage}]"
        @focusin='emitSelect(); focused = true'
        @focusout='focused = false')
    .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
</template>

<script>
import Input from '../../mixins/input'

export default {
  extends: Input,
  props: {
    rows: {
      type: Number,
      default: null
    }
  },
}
</script>

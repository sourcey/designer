<template lang="pug">
.item-wrap.textarea-input
  .form-group
    label.control-label(v-if='spec.label !== false' :for='inputId' v-b-tooltip :title='spec.tooltip') {{ inputLabel }}
    small.form-text(v-if='spec.hint' v-html='spec.hint')
    textarea.form-control(:id='inputId' :rows='spec.rows || 5'
        v-model='currentValue'
        :name='spec.field || spec.name'
        :placeholder='spec.placeholder'
        :class="{'is-invalid': errorMessage}"
        @focusin='emitSelect'
        @input='emitUpdate')
    .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
</template>

<script>
import Input from '../../mixins/input'

export default {
  extends: Input
}
</script>

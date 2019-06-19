<template lang="pug">
.item-wrap.text-input
  .form-group.align-items-center
    label.form-label(v-if='spec.label !== false' :for='inputId' v-b-tooltip :title='spec.hint') {{ inputLabel }}
    input.form-control(:type='spec.type'
        v-model='value'
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

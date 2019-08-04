<template lang="pug">
.item-wrap.text-input
  .form-group.align-items-center
    //- div {{item}}
    //- div {{value}}
    label.control-label(v-if='spec.label !== false' :for='inputId' v-b-tooltip :title='spec.hint') {{ inputLabel }}
    .input-group
      slot(name='prepend')
      input.form-control(:type='spec.type'
          v-model='currentValue'
          :name='spec.field || spec.name'
          :placeholder='spec.placeholder'
          :class="{'is-invalid': errorMessage}"
          @focusin='emitSelect'
          @input='emitUpdate')
      slot(name='append')
    .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
</template>

<script>
import Input from '../../mixins/input'

export default {
  extends: Input
}
</script>

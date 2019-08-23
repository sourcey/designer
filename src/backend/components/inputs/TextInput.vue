<template lang="pug">
.item-wrap.text-input
  .form-group(:class="{'is-invalid': errorMessage, 'is-focus': focused, 'is-empty': !value}")
    //- .form-group.align-items-center
    //- div {{item}}
    //- div {{value}}
    label.control-label(v-if='label !== false' :for='inputId' v-b-tooltip :title='hint') {{ inputLabel }}
    .input-group
      slot(name='prepend')
      input.form-control(:type='input || "text"'
          v-model='currentValue'
          :name='field || name'
          :placeholder='placeholder'
          :class="{'is-invalid': errorMessage}"
          @focusin='emitSelect(); focused = true'
          @focusout='focused = false')
      //- v-on='$listeners'
      //- @input='emitUpdate'
      slot(name='append')
    .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
</template>

<script>
import Input from '../../mixins/input'

export default {
  extends: Input
}
</script>

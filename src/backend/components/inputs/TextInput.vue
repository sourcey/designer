<template lang="pug">
.form-group.item-wrap.text-input(:class="{'is-invalid': errorMessage, 'is-focus': focused, 'is-empty': !value}")
  //- .form-group.align-items-center
  //- div {{item}}
  //- div {{label}}
  //- div {{name}}
  label.control-label(v-if='label !== false' :for='inputId' v-b-tooltip.hover :title='tooltip') {{ inputLabel }}
  .input-group
    slot(name='prepend')
    //- div {{currentValue}}
    input.form-control(:type='inputType'
        :value='displayValue'
        :name='field || name'
        :placeholder='placeholder'
        :required='required'
        :class="{'is-invalid': errorMessage}"
        @blur='currentValue = $event.target.value'
        @focusin='emitSelect(); focused = true'
        @focusout='focused = false')
    //- v-model='currentValue'
    //- v-on='$listeners'
    //- @input='emitUpdate'
    slot(name='append')
  .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
  .hint.mt-05(v-if='hint' v-html='hint')
</template>

<script>
import Input from '../../mixins/input'

export default {
  extends: Input,
  computed: {
    inputType () {
      if (this.input)
        return this.input
      if (this.type === 'number')
        return 'number'
      return 'text'
    }
  }
}
</script>

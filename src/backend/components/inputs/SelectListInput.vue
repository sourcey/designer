<template lang="pug">
.item-wrap.select-list-input
  .form-group(:class="{'is-invalid': errorMessage, 'is-focus': focused}")
    label.control-label(v-if='spec.label') {{ spec.label }}
    p.hint(v-if='spec.hint') {{ spec.hint }}
    .dropdown(:class='{"dropup": spec.dropup}' @click='$event.stopPropagation()')
      .input-group.transparent-input-group
        slot(name='prepend')
          .input-group-prepend
            span.input-group-text
              i.fal.fa-search
        input.form-control(
            ref='input'
            type='text'
            :placeholder='spec.placeholder'
            :class="{'is-invalid': errorMessage}"
            @focusin='focused = true'
            @input='filterValue = $event.target.value')
            //- @focusout='$nextTick(() => focused = false)'
            //- :required='required'
            //- v-model='object[name]'
            //- @focusout='focused = false'
            //- @input="$emit('update', name, value)"
        slot(name='append')
      .dropdown-menu(:class="{'show': focused}")
        div(v-if='visibleOptions.length')
          a.dropdown-item(:class="{'active': option.selected, 'disabled': option.disabled}"
              v-for='(option, index) in visibleOptions'
              href='#'
              @click.prevent='select(option)') {{ option.label }}
        .dropdown-item.no-data(v-else) No options to display
    .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
        //- :value='Array.isArray(value) ? value[1] : value'v-if='!option.hidden'
        //- :disabled='value[2] && value[2].disabled'
        //- :selected='optionIsSelected(value[0])'
    .selected-list
      .selected-item.flex-v-center(v-for='(option, index) in selectedOptions')
        input(type='hidden' :name='spec.field || spec.name' :value='option.value')
        .label.flex-fill {{ option.label }}
        button.btn.ml-1(@click.prevent="select(option)")
          i.fal.fa-trash-alt
    //- div.mb-2 {{ options }}
    //- div {{ value }}
</template>

<script>
// import Vue from 'vue'
// import { randomString } from '../../base/utils'
import Input from '../../mixins/input'
// import { randomString } from 'designer/app/javascript/base/utils'

export default {
  name: 'select-list',
  extends: Input,
  props: {
    // modal: {
    //   type: Object,
    //   default: () => {}
    // },
    // name: {
    //   type: String
    // },
    name: {
      type: String
    },
    label: {
      type: String
    },
    placeholder: {
      type: String
    },
    hint: {
      type: String
    },
    required: {
      type: Boolean,
      default: false
    },
    dropup: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
      // [Object, Array]
    },
    // validationErrors: {
    //   type: Object,
    //   default: () => {}
    // },
  },
  data () {
    return {
      // focused: false,
      // object: this.modal || this.$parent.modal || {},
      // value: [],
      filterValue: null,
      // visibleOptions: this.options,
      // errors: this.validationErrors || this.$parent.validationErrors,
      showSelected: true
    }
  },
  computed: {
    // object () {
    //   return this.object || this.$parent.object
    // },
    // value: {
    //   get: function () {
    //     if (typeof(this.object[this.name]) === 'undefined')
    //       this.$set(this.object, this.name, [])
    //       // this.object[this.name] = this.defaultValue
    //       // this.setDefaultValue() // $set(this.object, this.name, null) // setting a null value will ensure reactivity if unset
    //     return this.object[this.name]
    //   },
    //   set: function (newValue) {
    //     console.log('set input value', this.object, this.name, newValue)
    //     this.$set(this.object, this.name, this.formatValue(newValue))
    //     // this.object[this.name] = newValue
    //   }
    // },
    // inputId () {
    //   return this.name + '-' + randomString(10)
    // },
    // errorMessage () {
    //   if (this.errors && this.errors[this.name])
    //     return this.errors[this.name]
    // },
    visibleOptions () {
      if (this.filterValue)
        return this.spec.options.filter(x => x.label.toLowerCase().indexOf(this.filterValue) !== -1)
      return this.spec.options
    },
    selectedOptions () {
      const result = []
      this.spec.options.forEach(option => {
        if (this.value.includes(option.value)) {
          option.selected = true
          result.push(option)
        }
        else
          option.selected = false
      })
      return result
    },
    // value () {
    //   if (!this.object[this.name])
    //     this.$set(this.object, this.name, [])
    //   return this.object[this.name]
    // }
  },
  mounted () {
  },
  methods: {
    select (option) {
      console.log('select', option)
      const index = this.value.findIndex(x => x === option.value)
      const doSelect = index === -1
      this.$set(option, 'selected', doSelect)
      if (doSelect)
        this.value.push(option.value)
      else {
        this.value.splice(index, 1)
      }
      // console.log('VALS', this.value)
      // this.$emit('input', this.name, this.value)
      this.$refs.input.dispatchEvent(new Event('input', { bubbles: true }))
    },
    onBodyClick () {
      this.focused = false
    },
  },
  watch: {
    focused (val) {
      if (val) {
        document.body.addEventListener('click', this.onBodyClick, false)
      } else {
        document.body.removeEventListener('click', this.onBodyClick)
      }
    }
  }
}
</script>

<style scoped lang="scss">
// @import 'stylesheets/_dashboard-theme';
// @import 'stylesheets/_dashboard-mixins';

// .select-list-input {
//   position: relative;
// }
</style>

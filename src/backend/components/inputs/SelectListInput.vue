<template lang="pug">
.item-wrap.select-list-input
  .form-group(:class="{'is-invalid': errorMessage, 'is-focus': focused}")
    label.control-label(v-if='label') {{ label }}
    p.hint(v-if='hint') {{ hint }}
    //- div {{ object }}
    //- div ------------------------
    //- div {{ currentValue }}
    //- div {{ value }}
    //- @click='$event.stopPropagation()'
    .dropdown(:class='{dropup: dropup}')
      .input-group.transparent-input-group
        slot(name='prepend')
        input.form-control(
            ref='input'
            type='text'
            :placeholder='placeholder'
            :class="{'is-invalid': errorMessage}"
            @input='filterValue = $event.target.value'
            @focusin='focused = true')
            //- @focusout='focused = false'
            //- v-model='filterValue'
            //- @input='filterValue = $event.target.value'
            //- @focusout='$nextTick(() => focused = false)'
            //- :required='required'
            //- v-model='object[name]'
            //- @focusout='focused = false'
            //- @input="$emit('update', name, value)"
        slot(name='append')
      .dropdown-menu(:class="{show: focused}")
        div(v-if='visibleOptions.length')
          a.dropdown-item(:class="{active: option.selected, disabled: option.disabled}"
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
        input(type='hidden' :name='field || name' :value='option.value')
        .label.flex-fill {{ option.label }}
        button.btn.ml-1(@click.prevent="select(option)")
          icon(name='trash' size='14')
</template>

<script>
import Input from '../../mixins/input'

export default {
  name: 'select-list-input',
  extends: Input,
  props: {
    dropup: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array, // [Object, Array]
      default: () => []
    }
  },
  data () {
    return {
      filterValue: null,
      showSelected: true
    }
  },
  computed: {
    visibleOptions () {
      if (this.filterValue)
        return this.options.filter(x => x.label.toLowerCase().indexOf(this.filterValue) !== -1)
      return this.options
    },
    selectedOptions () {
      const result = []
      this.options.forEach(option => {
        if (this.currentValue && this.currentValue.includes(option.value)) {
          this.$set(option, 'selected', true)
          result.push(option)
        }
        else
          this.$set(option, 'selected', false)
      })
      return result
    }
  },
  methods: {
    select (option) {
      console.log('select', option, this.currentValue)
      const selected = this.currentValue ? [].concat(this.currentValue) : []
      if (selected.includes(option.value)) {
        selected.splice(selected.indexOf(option.value), 1)
      } else {
        selected.push(option.value)
      }
      console.log('selected', selected)
      this.currentValue = selected // will trigger $emit 'input'
      this.$nextTick(() => this.$forceUpdate()) // required to update dropdown selected values

      // console.log('select', option)
      // const index = this.currentValue.findIndex(x => x === option.value)
      // const doSelect = index === -1
      // this.$set(option, 'selected', doSelect)
      // if (doSelect)
      //   this.currentValue.push(option.value)
      // else {
      //   this.currentValue.splice(index, 1)
      // }
      // console.log('VALS', this.currentValue)
      // this.$emit('input', this.name, this.currentValue)
      this.$refs.input.dispatchEvent(new Event('input', { bubbles: true }))
    },
    onWindowClick () {
      // console.log('onWindowClick', this.$el.contains(event.target))
      if (!this.$el.contains(event.target)) {
        this.focused = false
      }
    }
  },
  watch: {
    focused (val) {
      // console.log('WATCH focused', val)
      if (val) {
        window.addEventListener('click', this.onWindowClick, false)
      } else {
        window.removeEventListener('click', this.onWindowClick)
      }
    }
  }
}
</script>

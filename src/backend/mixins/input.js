import { randomString, copyValue, titleize } from '../../base/utils'

export default {
  props: {
    // V-Model input value.
    value: {},

    // Model object attribute. If `field` is unset this will also set the
    // HTML name of the input.
    name: {
      type: String,
      required: true
    },

    // The option input object.
    // If this is defined it will be used instead of the parent form object.
    object: {
      type: Object,
      // default: () => {}
    },

    // HTML field name (if different to `name` ie. scoped)
    field: {
      type: String
    },

    // Input label text
    label: {
      type: [String,Boolean]
    },

    // Input must be set to submit the form
    required: {
      type: Boolean,
      default: false
    },

    // Default value
    default: {},

    // Input placeholder text
    placeholder: {
      type: String
    },

    // Hint text
    hint: {
      type: String
    },

    // Tooltip text
    tooltip: {
      type: String
    },

    // The display format function
    // This formats the value displayed to the user
    formatter: {
      type: [String, Function]
    },

    // The value sanitizer function
    // This formats the value saved to the backend
    sanitizer: {
      type: [Function]
    },

    // The HTML input type ie. text, password
    input: {
      type: String
    },

    // The spec definition for this input.
    // spec: {
    //   type: Object,
    //   default: () => { return {} }
    // },

    // @deprecated
    // parent: {
    //   type: Object,
    //   default: () => {}
    // },
    //
    // // @deprecated
    // root: {
    //   type: Object,
    //   default: () => {}
    // }
  },
  data () {
    return {
      // inputId: `input-${randomString(5)}`, // random breaks on SSR
      inputId: `input-${this.name}`,
      defaultValue: copyValue(this.default),
      initialValue: null, // copyValue(this.model[this.name || this.name]),
      // currentValue: this.value, // reference value for use with inner v-model
      focused: false,
      enableEvents: true,
      // recomputeValue: false,
    }
  },
  computed: {
    currentValue: {
      get: function () {
        if (this.value) {
          // console.log('input: get value', this.name, this.value)
          return this.value
        }
        if (this.currentObject) {
          // console.log('input: get object value', this.name, this.currentObject, this.currentObject[this.name])
          if (typeof(this.currentObject[this.name]) === 'undefined') {
            this.$set(this.currentObject, this.name, this.defaultValue)
          }
          // console.log('input: get object value 1', this.name, this.currentObject, this.currentObject[this.name])
          return this.currentObject[this.name]
        }
      },
      set: function (newValue) {
        const value = this.sanitizeValue(newValue)
        // if (this.currentObject && typeof(newValue) !== 'undefined') {
        //   this.$set(this.currentObject, this.name, value)
        // }
        if (this.currentObject && typeof(newValue) !== 'undefined') {
          this.$set(this.currentObject, this.name, value)
        }
        this.$emit('input', value)
      }
    },
    displayValue: {
      get: function () {
        // if (this.formatter) {
        //   return this.formatValue(this.currentValue)
        // }
        return this.formatValue(this.currentValue)
      },
      // set: function (value) {
      //   // const value = this.formatValue(newValue)
      //   // if (this.currentObject && typeof(newValue) !== 'undefined') {
      //   //   this.$set(this.currentObject, this.name, value)
      //   // }
      //   if (this.currentObject && typeof(value) !== 'undefined') {
      //     this.$set(this.currentObject, this.name, value)
      //   }
      //   this.$emit('input', value)
      // }
    },
    currentObject () {
      if (this.object)
        return this.object
      if (this.parentForm)
        return this.parentForm.object
    },
    isDefaultValue () {
      return this.currentValue === this.defaultValue
    },
    inputLabel () {
      if (this.label)
        return this.label
      if (this.name)
        return titleize(this.name)
    },
    parentForm () {
      let parent = this.$parent
      while (parent) {
        if (parent.validationErrors)
          return parent
        parent = parent.$parent
      }
    },
    validationErrors () {
      if (this.parentForm)
        return this.parentForm.validationErrors
      if (this.designerBackendState)
        return this.designerBackendState.validationErrors
      return {}
    },
    errorMessage () {
      // console.log('input: validation errors', this.validationErrors, this.validationErrors[this.name], this.name, this.name)
      if (this.validationErrors) {
        if (this.validationErrors[this.name])
          return this.validationErrors[this.name]

        // Sometimes validation error keys will be scoped by the model ie. `user.password`,
        // so attempt to match the last part of the key.
        const match = Object.keys(this.validationErrors).find(x => x.endsWith('.' + this.name))
        if (match) {
          return this.validationErrors[match]
        }
      }
    }
  },
  created () {
    // this.mergePropsIntoSpec()
    this.saveValue()
    // this.setInitialValue() // set the initial value with potential formatting
  },
  methods: {
    // mergePropsIntoSpec () {
    //   Object.assign(this.spec,
    //     ...Object.entries(this.$props).map(([key, value]) => (value !== undefined && { [key]: value })))
    //
    //   // console.log('PROPS', this.spec, this.$props)
    // },
    formatValue (value) {
      if (typeof(this.formatter) === 'function')
        return this.formatter(value)
      return value
    },
    sanitizeValue (value) {
      if (typeof(this.sanitizer) === 'function')
        return this.sanitizer(value)
      return value
    },
    setInitialValue () {
      console.log('!!!! set initial value', this.value, this.name, this.initialValue, this.formatValue(this.initialValue))
      // this.model[this.name || this.name] !== 'undefined' ? clone(this.model[this.name || this.name]) : null

      this.currentValue = this.initialValue // this.formatValue(this.initialValue)
      // this.formatValue()
      // this.emitUpdate()
    },
    setDefaultValue () {
      // console.log('!!!! set default value', this.value, this.name, this.defaultValue)
      this.currentValue = this.defaultValue
      // this.emitUpdate()
    },

    // This can be called when the outside form is saved to update the initial
    // value, so next time the form is reset it will revert to this value
    saveValue () {
      this.initialValue = copyValue(this.value || this.currentValue)
    },

    emitSelect () {
      if (this.enableEvents)
        this.$emit('select', this.name)
    },
    emitUpdate () {
      // console.log('!!!! emit update', this.name, this.currentValue, this.value) //model[this.name || this.name])
      this.$emit('input', this.currentValue)
      // if (this.enableEvents)
      //
      //   // HACK: We should be passing `this.value` but sometimes the computed
      //   // getter doesnt update after setting the value. This issue was noticed
      //   // when changing section layout and uploading an attachment on Artzine.
      //   // this.$emit('update', this.name, this.model[this.name || this.name])
      //   this.$emit('update', this.name, this.currentValue)
    }
  }
}

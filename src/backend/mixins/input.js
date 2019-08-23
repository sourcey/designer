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

    // The output format type
    format: {
      type: String
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
    // value: {
    //   get: function () {
    //     if (typeof(this.model[this.name || this.name]) === 'undefined') {
    //       this.$set(this.model, this.name, this.defaultValue)
    //     }
    //     return this.model[thi.model[this.name || this.name]) === 'undefined') {
        //   this.$set(this.model, this.name, this.defaultValue)
        // }
        // return this.model[this.name || this.names.name || this.name]
    //   },
    //   set: function (newValue) {
    //     // this.$set(this.model, this.name, this.formatValue(newValue))
    //
    //     this.model[this.name || this.name] = this.formatValue(newValue)
    //   }
    // },
    currentValue: {
      get: function () {
        // if (typeof(this.model[this.name || this.name]) === 'undefined') {
        //   this.$set(this.model, this.name, this.defaultValue)
        // }
        // return this.model[this.name || this.name]
        return this.value
      },
      set: function (newValue) {
        // this.$set(this.model, this.name, this.formatValue(newValue))
        const value = this.formatValue(newValue)
        this.$emit('input', value)
        // this.model[this.name || this.name] = this.formatValue(newValue)
      }
    },
    // defaultValue () {
    //   return this.spec.default || null
    // },
    // attribute () {
    //   return this.spec.name || null
    // },
    isDefaultValue () {
      return this.currentValue === this.defaultValue
    },
    inputLabel () { //name, spec
      if (this.label)
        return this.label
      // if (this.spec)
      //   return titleize(this.spec)
      if (this.name)
        return titleize(this.name)
      // if (this.name)
      //   return titleize(this.name)
    },
    // inputId () {
    //   // var s = `input-${randomString(5)}`
    //   // console.log('inputId', this.name, s)
    //   // return 's' //`input-${randomString(5)}`
    //   return `input-${this.name}`
    // },
    // model () {
    //   if (this.object)
    //     return this.object
    //   if (this.$parent.object)
    //     return this.$parent.object
    //   if (this.$parent.$parent.object)
    //     return this.$parent.$parent.object
    //   this.$set(this, 'object', {})
    //   return this.object
    // },

    parentForm () {
      let parent = this.$parent
      while (parent) {
        if (parent.validationErrors)
          return parent
        parent = parent.$parent
      }
    },
    validationErrors () {
      // console.log('input: this.parentForm', this.parentForm)
      // console.log('input: this.parentForm.validationErrors', this.parentForm.validationErrors)

      if (this.parentForm)
        return this.parentForm.validationErrors
      if (this.designerBackendState)
        return this.designerBackendState.validationErrors
      return {}
    },
    errorMessage () {
      // console.log('input: validation errors', this.validationErrors, this.validationErrors[this.name], this.name, this.name)
      if (this.validationErrors && this.validationErrors[this.name])
        return this.validationErrors[this.name]
    }
  },
  created () {
    // this.mergePropsIntoSpec()
    this.saveValue()
  },
  methods: {
    // mergePropsIntoSpec () {
    //   Object.assign(this.spec,
    //     ...Object.entries(this.$props).map(([key, value]) => (value !== undefined && { [key]: value })))
    //
    //   // console.log('PROPS', this.spec, this.$props)
    // },
    formatValue (value) {
      // console.log('!!!! format value', value)
      return value
    },
    setInitialValue () {
      // console.log('!!!! set initial value', this.model, this.name, this.defaultValue)
      // this.model[this.name || this.name] !== 'undefined' ? clone(this.model[this.name || this.name]) : null

      this.currentValue = this.initialValue
      this.emitUpdate()
    },
    setDefaultValue () {
      // console.log('!!!! set default value', this.model, this.name, this.defaultValue)
      this.currentValue = this.defaultValue
      this.emitUpdate()
    },

    // This can be called when the outside form is saved to update the initial
    // value, so next time the form is reset it will revert to this value
    saveValue () {
      this.initialValue = copyValue(this.value)
    },

    emitSelect () {
      if (this.enableEvents)
        this.$emit('select', this.name)
    },
    emitUpdate () {
      console.log('!!!! emit update', this.name, this.currentValue, this.value) //model[this.name || this.name])
      this.$emit('input', this.currentValue)
      // if (this.enableEvents)
      //
      //   // HACK: We should be passing `this.value` but sometimes the computed
      //   // getter doesnt update after setting the value. This issue was noticed
      //   // when changing section layout and uploading an attachment on Artzine.
      //   // this.$emit('update', this.name, this.model[this.name || this.name])
      //   this.$emit('update', this.name, this.currentValue)
    },

    // @deprecated
    // Just used for attachments
    fileMetadata () {
      const meta = {}
      if (this.parent && this.parent.id) {
        meta.designer_element_id = this.parent.id
      }
      return meta
    }
  }
}

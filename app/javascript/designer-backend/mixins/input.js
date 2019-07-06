import { randomString, copyValue, titleize } from '../../designer/utils'

export default {
  props: {
    name: {
      type: String,
      required: true
    },
    // name: {
    //   type: String,
    //   required: true
    // },
    object: {
      type: Object
      // required: true
      // ,
      // default: () => {}
    },
    spec: {
      type: Object,
      default: () => { return {} }
    },

    // @deprecated
    parent: {
      type: Object,
      default: () => {}
    },

    // @deprecated
    root: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      inputId: `input-${randomString(5)}`,
      defaultValue: copyValue(this.spec.default),
      initialValue: null, // copyValue(this.model[this.name]),
      focused: false,
      enableEvents: true,
      // recomputeValue: false,
    }
  },
  computed: {
    value: {
      get: function () {
        if (typeof(this.model[this.name]) === 'undefined') {
          this.$set(this.model, this.name, this.defaultValue)
        }
        return this.model[this.name]
      },
      set: function (newValue) {
        // this.$set(this.model, this.name, this.formatValue(newValue))

        this.model[this.name] = this.formatValue(newValue)
      }
    },
    // defaultValue () {
    //   return this.spec.default || null
    // },
    isDefaultValue () {
      return this.value === this.defaultValue
    },
    inputLabel () { //name, spec
      if (this.spec.label)
        return this.spec.label
      return titleize(this.name)
    },
    model () {
      if (this.object)
        return this.object
      if (this.$parent.object)
        return this.$parent.object
      if (this.$parent.$parent.object)
        return this.$parent.$parent.object
      // return this.object
    },
    validationErrors () {
      if (this.$parent.validationErrors)
        return this.$parent.validationErrors
      if (this.$parent.$parent.validationErrors)
        return this.$parent.$parent.validationErrors
      return this.designerBackendState.validationErrors
    },
    errorMessage () {
      console.log('input: validation errors', this.validationErrors[this.name])
      if (this.validationErrors && this.validationErrors[this.name])
        return this.validationErrors[this.name]
    }
  },
  created () {

    // Object.assign(this.spec, {
    //   input: this.input,
    //   label: this.label,
    //   placeholder: this.placeholder,
    //   required: this.required,
    //   format: this.format,
    //   field: this.field,
    //   options: this.options
    // })
    this.mergePropsIntoSpec()
    this.saveValue() // initialValue = copyValue(this.model[this.name])
    // this.cloneValue()
    // this.setDefaultValue()
    // this.setInitialValue()
  },
  methods: {
    mergePropsIntoSpec () {
      Object.assign(this.spec,
        ...Object.entries(this.$props).map(([key, value]) => (value !== undefined && { [key]: value })))

      // console.log('PROPS', this.spec, this.$props)
    },
    formatValue (value) {
      console.log('!!!! format value', value)
      return value
    },
    setInitialValue () {
      console.log('!!!! set default value', this.model, this.name, this.defaultValue)
      // this.model[this.name] !== 'undefined' ? clone(this.model[this.name]) : null

      this.value = this.initialValue
      this.emitUpdate()
    },
    setDefaultValue () {
      console.log('!!!! set default value', this.model, this.name, this.defaultValue)
      this.value = this.defaultValue
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
      // console.log('!!!! emitUpdate', this.name, this.model[this.name])
      if (this.enableEvents)

        // HACK: We should be passing `this.value` but sometimes the computed
        // getter doesnt update after setting the value. This issue was noticed
        // when changing section layout and uploading an attachment on Artzine.
        this.$emit('update', this.name, this.model[this.name])
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

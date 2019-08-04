import { randomString, copyValue, titleize } from '../../base/utils'

export default {
  props: {
    value: {
    },

    // The HTML field name
    name: {
      type: String,
      // required: true
    },

    // The model object attr name (may be different to name ie. unscoped)
    attr: {
      type: String,
      // required: true
    },

    // object: {
    //   type: Object
    //   // required: true
    //   // ,
    //   // default: () => {}
    // },
    spec: {
      type: Object,
      default: () => { return {} }
    },

    // The outer form instance with `validationErrors`
    // form: {
    //   type: Object,
    //   default: () => {}
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
      inputId: `input-${randomString(5)}`,
      defaultValue: copyValue(this.spec.default),
      initialValue: null, // copyValue(this.model[this.attr || this.name]),
      currentValue: this.value, // reference value for use with inner v-model
      focused: false,
      enableEvents: true,
      // recomputeValue: false,
    }
  },
  computed: {
    // value: {
    //   get: function () {
    //     if (typeof(this.model[this.attr || this.name]) === 'undefined') {
    //       this.$set(this.model, this.name, this.defaultValue)
    //     }
    //     return this.model[this.attr || this.name]
    //   },
    //   set: function (newValue) {
    //     // this.$set(this.model, this.name, this.formatValue(newValue))
    //
    //     this.model[this.attr || this.name] = this.formatValue(newValue)
    //   }
    // },
    // defaultValue () {
    //   return this.spec.default || null
    // },
    isDefaultValue () {
      return this.currentValue === this.defaultValue
    },
    inputLabel () { //name, spec
      if (this.spec.label)
        return this.spec.label
      if (this.spec.name)
        return titleize(this.spec.name)
      if (this.name)
        return titleize(this.name)
      if (this.attr)
        return titleize(this.attr)
    },
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
        if (parent.$options.validationErrors)
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
      console.log('input: validation errors', this.validationErrors[this.attr || this.name])
      if (this.validationErrors && this.validationErrors[this.attr || this.name])
        return this.validationErrors[this.attr || this.name]
    }
  },
  created () {
    this.mergePropsIntoSpec()
    this.saveValue()
  },
  methods: {
    mergePropsIntoSpec () {
      Object.assign(this.spec,
        ...Object.entries(this.$props).map(([key, value]) => (value !== undefined && { [key]: value })))

      console.log('PROPS', this.spec, this.$props)
    },
    formatValue (value) {
      console.log('!!!! format value', value)
      return value
    },
    setInitialValue () {
      console.log('!!!! set initial value', this.model, this.name, this.defaultValue)
      // this.model[this.attr || this.name] !== 'undefined' ? clone(this.model[this.attr || this.name]) : null

      this.currentValue = this.initialValue
      this.emitUpdate()
    },
    setDefaultValue () {
      console.log('!!!! set default value', this.model, this.name, this.defaultValue)
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
      console.log('!!!! emit update', this.name, this.currentValue) //model[this.attr || this.name])
      this.$emit('input', this.currentValue)
      // if (this.enableEvents)
      //
      //   // HACK: We should be passing `this.value` but sometimes the computed
      //   // getter doesnt update after setting the value. This issue was noticed
      //   // when changing section layout and uploading an attachment on Artzine.
      //   // this.$emit('update', this.name, this.model[this.attr || this.name])
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

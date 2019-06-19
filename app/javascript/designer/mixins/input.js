import { randomString, copyValue, titleize } from '../utils'

export default {
  // props: ['spec', 'name', 'item', 'parent', 'root'],
  props: {
    name: {
      type: String,
      required: true
    },
    item: {
      type: Object,
      default: () => {}
    },
    spec: {
      type: Object,
      default: () => { return {} }
    },
    parent: {
      type: Object,
      default: () => {}
    },
    root: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      inputId: `input-${randomString(5)}`,
      defaultValue: copyValue(this.spec.default),
      initialValue: copyValue(this.item[this.name]),
      enableEvents: true
      // object: this.item
    }
  },
  computed: {
    value: {
      get: function () {
        if (typeof(this.item[this.name]) === 'undefined')
          this.item[this.name] = this.defaultValue
          // this.setDefaultValue() // $set(this.item, this.name, null) // setting a null value will ensure reactivity if unset
        return this.item[this.name]
      },
      set: function (newValue) {
        console.log('set input value', this.item, this.name, newValue)
        this.$set(this.item, this.name, this.formatValue(newValue))
        // this.item[this.name] = newValue
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
    errorMessage () {
      // console.log('StandardInput validationErrors', this.designerState.validationErrors)
      if (this.designerState.validationErrors[this.name])
        return this.designerState.validationErrors[this.name]
    }
  },
  created () {
    // this.initialValue = this.cloneValue()
    // this.setDefaultValue()
    // this.setInitialValue()
  },
  methods: {
    // sanitizeValue (value) {
    //   return value
    // },
    formatValue (value) {
      // console.log('!!!! format value', value)
      return value
    },
    emitSelect () {
      if (this.enableEvents)
        this.$emit('select', this.name)
    },
    emitUpdate () {
      if (this.enableEvents)
        this.$emit('update', this.name, this.value)
    },
    setInitialValue () {
      // console.log('!!!! set default value', this.item, this.name, this.defaultValue)
      // this.item[this.name] !== 'undefined' ? clone(this.item[this.name]) : null

      this.value = this.initialValue
      this.emitUpdate()
    },
    setDefaultValue () {
      // console.log('!!!! set default value', this.item, this.name, this.defaultValue)
      this.value = this.defaultValue
      this.emitUpdate()
    },

    // This can be called when the outside form is saved to update the initial
    // value, so next time the form is reset it will revert to this value
    saveValue () {
      this.initialValue = copyValue(this.value)
    },

    // setDefaultValue () {
    //   this.setDefaultValue()
    // },
    fileMetadata () {
      const meta = {}
      if (this.parent && this.parent.id) { //this.root &&
        // if (this.root.elements) // TODO: better way of detecting page
        //   meta.designer_page_id = this.root.id
        // if (this.root.id !== this.parent.id)
          meta.designer_element_id = this.parent.id
      }
      // // else if (this.parent) {
      // //   meta.designer_element_id = this.parent.id
      // // }
      // meta.designer_element_id = this.item.id
      return meta
    }
  }
}

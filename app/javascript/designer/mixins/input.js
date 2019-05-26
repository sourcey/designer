import { randomString, titleize } from '../utils'

export default {
  props: ['spec', 'name', 'item', 'parent', 'root'],
  data() {
    return {
      inputId: `input-${randomString(5)}`,
      // object: this.item
    }
  },
  computed: {
    // value () {
    //   return this.item[this.name]
    // },
    value: {
      get: function () {
        if (!this.item[this.name])
          this.setDefaultValue() // $set(this.item, this.name, null) // setting a null value will ensure reactivity if unset
        return this.item[this.name]
      },
      set: function (newValue) {
        console.log('set input value', this.item, this.name, newValue)
        this.$set(this.item, this.name, newValue)
        // this.item[this.name] = newValue
      }
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
  methods: {
    emitSelect () {
      this.$emit('select', this.name)
    },
    emitUpdate () {
      this.$emit('update', this.name, this.value)
    },
    setDefaultValue () {
      this.$set(this.item, this.name, this.spec.default || null)
    },
    fileMetadata () {
      // return {
      //   designer_element_id: this.item.id
      // }
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

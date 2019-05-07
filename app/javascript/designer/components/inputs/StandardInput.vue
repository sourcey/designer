<template lang="pug">
.item-wrap
  //-
    <br>object: >>>
    <br>{{JSON.stringify(object)}}
    <br>spec: >>>
    <br>{{spec}}
  .form-group(v-if="spec.type === 'string' && spec.multiline")
    label.form-label(v-if='spec.label !== false' :for="'input-' + id" v-b-tooltip :title='spec.hint') {{ itemLabel(name, spec) }}
    textarea.form-control(:id="'input-' + id" rows='5'
        v-model='object[name]'
        :placeholder='spec.placeholder'
        :class="{'is-invalid': errorMessage}"
        @focusin="$emit('select', name)"
        @input="$emit('update', name, object[name])")
    .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
  .form-group.align-items-center(v-else-if='spec.enum')
    label.form-label(v-if='spec.label !== false' :for="'input-' + id" v-b-tooltip :title='spec.hint') {{ itemLabel(name, spec) }}
    select.form-control(:id="'input-' + id"
        v-model='object[name]'
        :class="{'is-invalid': errorMessage}"
        @focusin="$emit('select', name)"
        @change="$emit('update', name, object[name])")
      option(v-if='!spec.required' value='') Please select one
      option(v-for='(value, index) in spec.enum' :value='typeof(value) === "string" ? value : Object.keys(value)[0]') {{ typeof(value) === 'string' ? value : value[Object.keys(value)[0]] }}
    .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
  .form-group.form-row.align-items-center(v-else-if="spec.type === 'boolean'")
    label.col-form-label(v-if='spec.label !== false' :for="'input-' + id" v-b-tooltip :title='spec.hint') {{ itemLabel(name, spec) }}
    .flex-fill
    div
      .custom-control.custom-checkbox
        input.custom-control-input(
            type='checkbox'
            v-model='object[name]'
            :id="'input-' + id")
        label.custom-control-label(:for="'input-' + id")
    .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
  .form-group.align-items-center(v-else-if="spec.type === 'number'")
    label.col-form-label.form-label(v-if='spec.label !== false' :for="'input-' + id" v-b-tooltip :title='spec.hint') {{ itemLabel(name, spec) }}
    input.form-control(type='number'
        v-model.number='object[name]'
        :placeholder='spec.placeholder'
        :class="{'is-invalid': errorMessage}"
        @focusin="$emit('select', name)"
        @input="$emit('update', name, object[name])")
    .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
  .form-group.align-items-center(v-else='')
    label.form-label(v-if='spec.label !== false' :for="'input-' + id" v-b-tooltip :title='spec.hint') {{ itemLabel(name, spec) }}
    //- // <label v-if="spec.label !== false" :for="'input-' + id" class="col-lg-4 col-form-label">{{ itemLabel(name, spec) }}</label>
    input.form-control(:type='spec.type'
        v-model='object[name]'
        :placeholder='spec.placeholder'
        :class="{'is-invalid': errorMessage}"
        @focusin="$emit('select', name)"
        @input="$emit('update', name, object[name])")
    .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
  //- // <small v-if="spec.hint" class="text-muted">{{ spec.hint }}</small>
</template>

<script>
import { randomString } from '../../utils'


export default {
  props: ['spec', 'name', 'item', 'parent', 'root'],
  // components: {
  //   FormLabel
  // },
  data() {
    return {
      id: this.item.id || randomString(5),
      object: this.item // || {}
    }
  },
  // beforeMount() {
  //   // console.log('StandardInput', this.object, this.spec.default)
  //   // this.object[this.name] = this.object[this.name] || this.spec.default
  // },
  // created() {
  //   console.log('StandardInput', this, this.spec, this.name, this.item)
  // },
  computed: {
    errorMessage () {
      // console.log('StandardInput validationErrors', this.designerState.validationErrors)
      if (this.designerState.validationErrors[this.name])
        return this.designerState.validationErrors[this.name]
    }
  },
  // watch: {
  //   object: {
  //     handler: function(newValue) {
  //       console.log('input object changed', this.object[this.name])
  //     },
  //     deep: true
  //   },
  // }
  // methods: {
  //   tagArrayToObject(tags) {
  //     return tags.reduce((acc, cur, i) => {
  //       acc[cur] = cur
  //       return acc
  //     }, {})
  //   }
  // }
}
</script>

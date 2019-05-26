<template lang="pug">
.item-wrap
  .form-group.form-row.align-items-center
    label.form-label(v-if='spec.label !== false' :for="'input-' + item.id" v-b-tooltip :title='spec.hint') {{ inputLabel }}
    .col
      tags-input(
          :id="'input-' + item.id"
          element-id='tags'
          v-model='item[name]'
          :existing-tags='tagArrayToObject(spec.enum)'
          :typeahead='true'
          :typeahead-activation-threshold='0'
          :only-existing-tags='!spec.custom')
</template>

<script>
import Input from '../../mixins/input'
import Vue from 'vue'
import VoerroTagsInput from '@voerro/vue-tagsinput'

Vue.component('tags-input', VoerroTagsInput)

export default {
  extends: Input,
  methods: {
    tagArrayToObject(tags) {
      return tags.reduce((acc, cur, i) => {
        acc[cur] = cur
        return acc
      }, {})
    }
  }
}
</script>

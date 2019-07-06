<template lang="pug">
.item-wrap.designer-tags-input
  .form-group
    //- .form-row.align-items-center
    label.control-label(v-if='spec.label !== false' :for='inputId' v-b-tooltip :title='spec.hint') {{ inputLabel }}
    //- .col
    voerro-tags-input(
        :id='inputId'
        element-id='tags'
        v-model='value'
        :existing-tags='spec.options'
        :typeahead='true'
        :typeahead-activation-threshold='0'
        :only-existing-tags='!spec.custom'
        @tags-updated='emitUpdate')
        //- :existing-tags='tagArrayToObject(spec.options)'
</template>

<script>
import Input from '../../mixins/input'
import Vue from 'vue'
import VoerroTagsInput from '@voerro/vue-tagsinput'

export default {
  extends: Input,
  components: { VoerroTagsInput },
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

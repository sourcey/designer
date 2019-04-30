<template lang="pug">
.item-wrap
  .form-group.form-row.align-items-center
    //- (if="spec.type == 'array'")
    //- form-label(v-bind:name='name', v-bind:spec='spec')
    label.form-label(v-if='spec.label !== false' :for="'input-' + object.id" v-b-tooltip :title='spec.hint') {{ itemLabel(name, spec) }}
    .col
      tags-input(:id="'input-' + object.id", element-id='tags', v-model='object[name]', :existing-tags='tagArrayToObject(spec.enum)', :typeahead='true', :typeahead-activation-threshold='0', :only-existing-tags='!spec.custom')
</template>

<script>
import Vue from 'vue'
// import FormLabel from '../FormLabel'
import VoerroTagsInput from '@voerro/vue-tagsinput'

Vue.component('tags-input', VoerroTagsInput)


export default {
  props: ['spec', 'name', 'item', 'parent', 'root'],
  // components: {
  //   FormLabel, VoerroTagsInput
  // },
  data() {
    return {
       object: this.item
    }
  },
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

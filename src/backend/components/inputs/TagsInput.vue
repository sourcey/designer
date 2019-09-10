<template lang="pug">
.item-wrap.designer-tags-input
  .form-group
    label.control-label(v-if='label !== false' :for='inputId' v-b-tooltip :title='tooltip') {{ inputLabel }}
    //- .col
    //- no-ssr
    //- div {{options}}
    //- div {{existingTags}}
    //- div {{currentValue}}
    voerro-tags-input(
        ref='tags'
        v-model='currentValue'
        :element-id='field || name'
        :id='inputId'
        :placeholder='placeholder'
        :existing-tags='existingTags'
        :typeahead='true'
        :typeahead-activation-threshold='0'
        :only-existing-tags='!custom'
        :limit='max'
        @tags-updated='emitCustomUpdate')
        //- :existing-tags='tagArrayToObject(options)'
    .hint.mt-075(v-if='hint' v-html='hint')
</template>

<script>
import Input from '../../mixins/input'
// import Vue from 'vue'
import { isObject } from '../../../base/utils'
// import VoerroTagsInput from '@voerro/vue-tagsinput' // breaks SSR
import VoerroTagsInput from '@voerro/vue-tagsinput/src/VoerroTagsInput.vue'

export default {
  name: 'tags-input',
  extends: Input,
  components: {
    VoerroTagsInput
  },
  props: {
    custom: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      // default: () => []
      // [Object, Array]
    },
    max: {
      type: Number
    }
  },
  computed: {
    existingTags () {
      if (isObject(this.options)) {
        return this.options
      } else if (Array.isArray(this.options)) {
        return this.options.reduce((acc, cur, i) => {
          acc[cur] = cur
          return acc
        }, {})
      }
    }
  },
  methods: {
    emitCustomUpdate (value) {
      // Ensure the outside form receives input events when tags change
      this.$refs.tags.$refs.taginput.dispatchEvent(new Event('input', { bubbles: true }))
      // this.emitUpdate()
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@voerro/vue-tagsinput/dist/style.css'
</style>

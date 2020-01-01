<template lang="pug">
.item-wrap.designer-tags-input(:class="{'is-invalid': errorMessage, 'is-focus': focused, 'is-empty': !value}")
  .form-group
    label.control-label(v-if='label !== false' :for='inputId' v-b-tooltip.hover :title='tooltip') {{ inputLabel }}
    //- .col
    //- no-ssr
    //- div {{options}}
    //- div {{currentValue}}
    //- div {{existingTags}}
    //- div -------------------------------------
    //- div {{selectedTags}}
    //- div -------------------------------------
    //- div {{currentValue}}
    voerro-tags-input(
        ref='tags'
        v-model='selectedTags'
        :id='inputId'
        :element-id='null'
        :class="{'is-invalid': errorMessage}"
        :placeholder='placeholder'
        :existing-tags='existingTags'
        :typeahead='true'
        typeahead-style='badges'
        :typeahead-activation-threshold='0'
        :add-tags-on-comma='true'
        :add-tags-on-space='true'
        :only-existing-tags='!custom'
        :limit='max'
        @initialized='onTagsInitialized'
        @tags-updated='emitCustomUpdate')
        //- @keyup='onKeyUp'
        //- :element-id='field || name'
        //- @tag-added='tagAdded'
        //- :existing-tags='tagArrayToObject(options)'
    input(
        type='hidden'
        :name='(field || name) + "[]"'
        :value='tag'
        v-for='(tag, index) in currentValue')
    .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
    .hint.mt-05(v-if='hint' v-html='hint')
</template>

<script>
import Input from '../../mixins/input'
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
      type: [Object, Array],
      // default: () => []
      // [Object, Array]
    },
    max: {
      type: Number
    }
  },
  data () {
    return {
      selectedTags: [],
      skipEvents: true
    }
  },
  created () {
    if (Array.isArray(this.currentValue)) {
      this.selectedTags = this.currentValue.map(x => {
        return {key: x, value: this.tagLabel(x)}
      })
    }
  },
  computed: {
    existingTags () {
      if (Array.isArray(this.options)) {
        this.options.map(x => { return {key: x.value, value: x.label}})
      } else if (isObject(this.options)) {
        const tags = []
        Object.keys(this.options).forEach(x => tags.push({key: x, value: this.options[x]}))
        return tags
      }
    }
  },
  methods: {
    formatTags (value) {
      if (Array.isArray(value)) {
        return value.map(x => { return {key: x.value, value: x.label}})
      } else if (isObject(value)) {
        const tags = []
        Object.keys(value).forEach(x => tags.push({key: x, value: value[x]}))
        return tags
      }
    },
    tagLabel (key) {
      if (Array.isArray(this.options)) {
        const option = this.options.filter(x => x.value === key)
        if (option && option.label)
          return option.label
      } else if (isObject(this.options) && this.options[key]) {
        return this.options[key]
      }
      return key
    },
    onTagsInitialized () {
      this.$nextTick(() => this.skipEvents = false)

      // this.$
      // tabIndex="-1"
    },
    emitCustomUpdate () {
      // BUG: The tags-update event always fires on init so just skip them
      if (this.skipEvents) {
        return
      }

      this.currentValue = this.selectedTags.map(x => x.key.length ? x.key : x.value)

      // Ensure the outside form receives input events when tags change
      if (this.$refs.tags && this.$refs.tags.$refs.taginput)
        this.$refs.tags.$refs.taginput.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@voerro/vue-tagsinput/dist/style.css';
</style>

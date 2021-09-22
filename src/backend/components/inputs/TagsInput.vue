<template lang="pug">
.item-wrap.designer-tags-input(:class="{'is-invalid': errorMessage, 'is-focus': focused, 'is-empty': !value, 'has-max-tags': hasMaxTags, 'has-tags': !!selectedTags.length}")
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
    //- voerro-tags-input(
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
    b-form-tags(v-if='!optionLabels.length'
        v-model='selectedTags'
        :input-id='inputId'
        :limit='max'
        tag-variant='info'
        :separator='separator'
        no-outer-focus
        remove-on-delete)
    b-form-tags.tag-select(v-else v-model='selectedTags' :input-id='inputId' :limit='max' :separator='separator' no-outer-focus)
      template(v-slot='{ tags, disabled, addTag, removeTag }')
        ul.list-unstyled.mb-0.d-flex.flex-wrap.align-items-center
          b-form-tag(v-for='tag in tags' :key='tag' tag='li' @remove='removeTag(tag)' :title='tag' :disabled='disabled' variant='info') {{ tag }}
        small.form-text.text-muted(v-if='hasMaxTags') Tag limit reached
        b-dropdown(v-else size='sm' variant='outline-secondary' block='' menu-class='w-100')
          template(#button-content='')
            | Choose tags
          .pb-05.px-075
            input.form-control.form-control-sm(v-model='search'
                type='search'
                @input='e => e.stopPropagation()'
                placeholder='Search tags...'
                autocomplete='off')
          b-dropdown-divider
          .dropdown-tags.px-075.py-075(v-if='availableOptions.length > 0')
            span.badge.badge-sm.badge-info.mr-025(v-for='option in availableOptions' :key='option' :title='option' @click='onOptionClick({ option, addTag })')
              | {{ option }}
          small.form-text.text-muted.px-075.mt-05(v-else)
            | There are no tags available to select
    input(
        ref='taginput'
        type='hidden'
        :name='(field || name) + "[]"'
        :value='tag'
        v-for='(tag, index) in currentValue')
    //- div {{ currentValue }}
    .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
    .hint.mt-05(v-if='hint' v-html='hint')
</template>

<script>
import Input from '../../mixins/input'
import { isObject, titleize } from '../../../base/utils'

export default {
  name: 'tags-input',
  extends: Input,
  components: {
  },
  props: {
    custom: {
      type: Boolean,
      default: false
    },
    options: {
      type: [Object, Array],
      // default: () => []
    },
    separator: {
      type: [String, Array],
      default: '.;' //[',', ';']
      // default: () => []
    },
    max: {
      type: Number
    }
  },
  data () {
    return {
      search: '',
      selectedTags: [],
      skipEvents: true
    }
  },
  created () {
    if (Array.isArray(this.options)) {
      this.selectedTags = this.currentValue
    } else if (isObject(this.options)) {
      this.selectedTags = Object.keys(this.options).map(x =>
        this.currentValue.indexOf(x) !== -1 ? this.options[x] : null).filter(_ => _)
    }
  },
  computed: {
    criteria() {
      return this.search.trim().toLowerCase()
    },
    optionLabels() {
      if (Array.isArray(this.options)) {
        return this.options
      } else if (isObject(this.options)) {
        return Object.values(this.options)
      }
      else {
        return []
      }
    },
    selectedValues() {
      if (Array.isArray(this.options)) {
        return this.selectedTags
      } else if (isObject(this.options)) {
        return this.selectedTags.map(x => Object.keys(this.options).find(key => this.options[key] === x))
      } else {
        return this.selectedTags
      }
    },
    availableOptions() {
      const options = this.optionLabels.filter(x => this.selectedTags.indexOf(x) === -1)
      if (this.criteria) {
        return options.filter(x => x.toLowerCase().indexOf(this.criteria) !== -1);
      }
      return options
    },
    // searchDesc() {
    //   if (this.criteria && this.availableOptions.length === 0) {
    //     return 'There are no tags matching your search criteria'
    //   }
    //   return ''
    // },
    hasMaxTags () {
      return this.max && this.selectedTags.length >= this.max
    }
  //   existingTags () {
  //     if (Array.isArray(this.options)) {
  //       return this.options.map(x => { return {key: x.value, value: x.label}})
  //     } else if (isObject(this.options)) {
  //       const tags = []
  //       Object.keys(this.options).forEach(x => tags.push({key: x, value: this.options[x]}))
  //       return tags
  //     }
  //   }
  },
  // mounted() {
  //   this.$nextTick(() => this.skipEvents = false)
  // },
  methods: {
    onOptionClick({ option, addTag }) {
      addTag(option)
      this.search = ''
    },
    // tagLabel (key) {
    //   if (Array.isArray(this.options)) {
    //     const option = this.options.filter(x => x.value === key)
    //     if (option && option.label)
    //       return option.label
    //   } else if (isObject(this.options) && this.options[key]) {
    //     return this.options[key]
    //   }
    //   return titleize(key)
    // },
    // onChange(event) {
    //   console.log(event)
    // }
  //   formatTags (value) {
  //     if (Array.isArray(value)) {
  //       return value.map(x => { return {key: x.value, value: x.label}})
  //     } else if (isObject(value)) {
  //       const tags = []
  //       Object.keys(value).forEach(x => tags.push({key: x, value: value[x]}))
  //       return tags
  //     }
  //   },
  //   onTagsInitialized () {
  //     this.$nextTick(() => this.skipEvents = false)
  //
  //     // this.$
  //     // tabIndex="-1"
  //   },
  //   emitCustomUpdate () {
  //     // BUG: The tags-update event always fires on init so just skip them
  //     if (this.skipEvents) {
  //       return
  //     }
  //
  //     this.currentValue = this.selectedTags.map(x => x.key.length ? x.key : x.value)
  //
  //     // Ensure the outside form receives input events when tags change
  //     if (this.$refs.tags && this.$refs.tags.$refs.taginput)
  //       this.$refs.tags.$refs.taginput.dispatchEvent(new Event('input', { bubbles: true }))
  //   }
  },
  watch: {
    selectedTags (val) {
      // BUG: The tags-update event always fires on init so just skip them
      if (this.skipEvents) {
        this.skipEvents = false
        return
      }

      this.currentValue = this.selectedValues

      // Ensure the outside form receives input events when tags change
      if (this.$refs.taginput && this.$refs.taginput[0])
        this.$refs.taginput[0].dispatchEvent(new Event('input', { bubbles: true }))
    },
  },
}
</script>

<style scoped lang="scss">
// @import '~@voerro/vue-tagsinput/dist/style.css';
</style>

<template lang="pug">
.designer-font-input
  .item-wrap
    .form-group.designer-select
      a.input-reset(v-if='!isDefaultValue' @click.prevent='setDefaultValue' href='#') x
      label.dropdown-label(:for='inputId' v-b-tooltip :title='spec.hint' @click.prevent='showFontDialog')
        .dropdown-label-text {{ inputLabel }}
        icon(name='caret-down' size='16')
      .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
  dialog-window(v-if='fontDialogOptions' :options='fontDialogOptions' @close='fontDialogOptions = null')
    .item-wrap
      .form-group.designer-select(:title='state.errorText')
        a.input-reset(v-if='!isDefaultFontFamily' @click.prevent='restoreDefaultFontFamily' href='#') x
        label.dropdown-label(:for='inputId' v-b-tooltip :title='spec.hint' @click.prevent='showFamilyDialog')
          .dropdown-label-text.font-name(:style='fontStyle(activeFontFamily)') {{activeFontFamily}}
          span.icon.spinner-border.spinner-border-sm(v-if="state.loadingStatus === 'loading'" role='status' aria-hidden='true')
          icon(name='caret-down' size='16')
    designer-select-input(v-if='value && value.weights' :object='value' name='weight' :spec='fontWeightSpec' @update='emitUpdate')
    designer-select-input(v-if='value' :object='value' name='style' :spec='fontStyleSpec' @update='emitUpdate')
  //- .wrapper.mx-2(v-if='showFamilyDialog')
  dialog-window.font-menu(v-if='familyDialogOptions' :options='familyDialogOptions' @close='familyDialogOptions = null')
    //- @scroll='onScroll'
    a.dropdown-item(href='#' v-for='font in fontArray' :key='font.family' :style='fontStyle(font.family)' :class="[{'active': font.family === activeFontFamily}]" @click.prevent='fontManager.setActiveFont(font.family)') {{font.family}}
</template>

<script>
import DialogWindow from '../DialogWindow'
import SelectInput from './SelectInput'
import Input from '../../mixins/input'
import { clone } from '../../../designer/utils'
import FontManager from 'font-picker/dist/font-manager/font-manager/FontManager.js'

export default {
  extends: Input,
  components: {
    DialogWindow,
    SelectInput
  },
  data () {
    return {
      fontDialogOptions: null,
      familyDialogOptions: null,
      // dialogOverlayStyle: null,
      state: {
        errorText: '',
        loadingStatus: 'loading' // possible values: 'loading', 'finished', 'error'
      },
      options: {
        limit: 200
      },
      fontManager: null,
    }
  },
  mounted() {

    // Initialize FontManager item and generate the font list
    this.fontManager = new FontManager(
      this.designerBackendState.googleFontsApiKey,
      this.activeFontFamily,
      this.options,
      this.onChange
    )
    this.fontManager.init()
      .then(() => {
        this.setState({
          errorText: null,
          loadingStatus: 'finished'
        })

        // if (this.activeFontFamily)
        //   this.setActiveFont(this.activeFontFamily)
      })
      .catch(err => {
        this.setState({
          errorText: `Error trying to fetch the list of available fonts: ${err}`,
          loadingStatus: 'error'
        })
      })
  },
  computed: {
    activeFontFamily () {
      return this.value ? this.value.family : null
    },
    // defaultValue () {
    //   return clone(this.spec.default)
    // },
    isDefaultValue () {
      return !this.spec.default || !this.value || (
        this.spec.default.family === this.value.family &&
        this.spec.default.weight === this.value.weight &&
        this.spec.default.style === this.value.style)
    },
    isDefaultFontFamily () {
      return !this.spec.default || !this.value || (
        this.spec.default.family === this.value.family)
    },
    fontWeightSpec () {
      return {
        label: 'Weight',
        options: this.value.weights.filter(x => String(x).indexOf('i') === -1),
        default: String(this.spec.default.weight || '400'),
        required: true
      }
    },
    fontStyleSpec () {
      return {
        label: 'Style',
        options: ['regular', 'italic'],
        default: String(this.spec.default.style || 'regular'),
        required: true
      }
    },
    fontArray () {
			const fonts = Array.from(this.fontManager.fonts.values())
			return fonts.sort((font1, font2) => font1.family.localeCompare(font2.family))
    }
  },
  methods: {
    setState (state) {
      this.state = Object.assign(this.state, state)
    },
    showFontDialog () {
      const rect = this.$el.getBoundingClientRect()
      const childRect = this.$el.firstElementChild.firstElementChild.getBoundingClientRect()

      this.fontDialogOptions = {
        x: childRect.left - rect.left,
        y: rect.top,
        width: childRect.width,
        draggable: false,
        bodyClass: 'py-05',
        overlayStyle: {
          left: rect.left + 'px',
          width: rect.width + 'px'
        }
      }
    },
    showFamilyDialog () {
      const rect = this.$el.getBoundingClientRect()
      const childRect = this.$el.firstElementChild.firstElementChild.getBoundingClientRect()

      this.familyDialogOptions = {
        x: childRect.left - rect.left + 15,
        y: 65,
        width: childRect.width - 30,
        draggable: false,
        overlayStyle: {
          left: rect.left + 'px',
          width: rect.width + 'px'
        }
      }
    },
    serializeFont (font) {
      return {
        family: font.family,
        category: font.category,
        weight: this.value.weight,
        style: this.value.style,
        weights: font.variants.map(x => {
          if (x === 'regular')
            return '400'
          if (x === 'italic')
            return '400i'
          return x.replace(/talic$/, '')
        })
      }
    },
    restoreDefaultFontFamily () {
      this.value.family = this.defaultValue.family
    },
    fontStyle (fontFamily) {
      return {"font-family": fontFamily}
    },
    onChange (font) {
      const data = this.serializeFont(font)
      console.log('font changed', font, data)
      this.value = data
      this.emitUpdate()
    }

    // Download the font previews for all visible font entries and the five after them
    // onScroll (e) {
    //   const elementHeight = e.target.scrollHeight / this.fontManager.fonts.length;
    //   const downloadIndex = Math.ceil((e.target.scrollTop + e.target.clientHeight) / elementHeight)
    //   this.fontManager.downloadPreviews(downloadIndex + 5)
    // },
  }
}
</script>

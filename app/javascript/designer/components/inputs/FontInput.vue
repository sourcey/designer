<template lang="pug">
.font-input
  .item-wrap
    .form-group.designer-select
      label.dropdown-label(:for="inputId" v-b-tooltip :title='spec.hint' @click.prevent='showFontDialog = !showFontDialog')
        .dropdown-label-text {{ inputLabel }}
        icon(name='caret-down' size='16')
      .invalid-feedback.d-block(v-if='errorMessage') {{ errorMessage }}
  .wrapper.mx-1(v-if='showFontDialog')
    dialog-window.w-100.py-05(:draggable='false' @close='showFontDialog = false')
      .item-wrap
        .form-group.designer-select(:title='state.errorText')
          label.dropdown-label(:for="inputId" v-b-tooltip :title='spec.hint' @click.prevent='showFamilyDialog = !showFamilyDialog')
            .dropdown-label-text.font-name(:class='fontClass(activeFont)') {{activeFont}}
            span.icon.spinner-border.spinner-border-sm(v-if="state.loadingStatus === 'loading'" role='status' aria-hidden='true')
            icon(name='caret-down' size='16')
      select-input(v-if='value && value.weights' :item='value' name='weight' :spec='fontWeightSpec' @update='emitUpdate')
      select-input(v-if='value' :item='value' name='style' :spec='fontStyleSpec' @update='emitUpdate')
  .wrapper.mx-2(v-if='showFamilyDialog')
    dialog-window.font-menu.w-100(:draggable='false' @close='showFamilyDialog = false')
      a.dropdown-item(href='#' v-for='font in fontManager.fonts' :key='font.family' :class="[fontClass(font.family), {'active-font': font.family === activeFont}]" @click.prevent='onChange(font)') {{font.family}}

  //- .form-group.form-row.align-items-center
    label.col-10.col-form-label(:for="'input-' + name") {{ inputLabel }}
    .col
      //- b-dropdown.font-picker.w-100(variant='block form-control' :title='state.errorText' @scroll='onScroll' no-caret)
        template(slot='button-content')
          //- button.form-control.dropdown-toggle(data-toggle='dropdown', type='button')
          span.font-name(:class='fontClass(activeFont)') {{activeFont}}
          span.spinner-border.spinner-border-sm.ml-05(v-if="state.loadingStatus === 'loading'", role='status', aria-hidden='true')
        b-dropdown-item(href='#',
            v-for='font in fontManager.fonts',
            :key='font.family',
            :class="[fontClass(font.family), {'active-font': font.family === activeFont}]",
            @click.prevent='onChange(font)') {{font.family}}
      .dropdown.font-picker(:title='state.errorText')
        button.form-control.dropdown-toggle.no-caret(@click.prevent='showFamilyDialog = !showFamilyDialog')
          span.font-name(:class='fontClass(activeFont)') {{activeFont}}
          span.spinner-border.spinner-border-sm.ml-05(v-if="state.loadingStatus === 'loading'", role='status', aria-hidden='true')
        .dropdown-menu.w-100(v-if="state.loadingStatus === 'finished' && fontManager.fonts" :class='{show: showFamilyDialog}' @scroll='onScroll')
          a.dropdown-item(href='#', v-for='font in fontManager.fonts', :key='font.family', :class="[fontClass(font.family), {'active-font': font.family === activeFont}]", @click.prevent='onChange(font)') {{font.family}}
</template>

<script>
import DialogWindow from '../DialogWindow'
import SelectInput from './SelectInput'
import Input from '../../mixins/input'
import { FontManager } from 'font-picker'

export default {
  extends: Input,
  components: {
    DialogWindow,
    SelectInput
  },
  data() {
    return {
      showFontDialog: false,
      showFamilyDialog: false,
      state: {
        errorText: '',
        loadingStatus: 'loading' // possible values: 'loading', 'finished', 'error'
      },
      options: {},
      fontManager: null,
    }
  },
  mounted() {

    // Initialize FontManager item and generate the font list
    this.fontManager = new FontManager(
      this.designerState.googleFontsApiKey,
      this.activeFont,
      this.options
    )
    this.fontManager.init()
      .then(() => {
        // font list has finished loading
        this.setState({
          errorText: '',
          loadingStatus: 'finished'
        })

        if (this.activeFont)
          this.setActiveFont(this.activeFont)
      })
      .catch(err => {
        // error while loading font list
        this.setState({
          errorText: 'Error trying to fetch the list of available fonts',
          loadingStatus: 'error'
        })
        // console.error(this.state.errorText)
        // console.error(err)
      })
  },
  computed: {
    activeFont () {
      return this.value ? this.value.family : null
    },
    fontWeightSpec () {
      return {
        label: 'Weight',
        enum: this.value.weights.filter(x => String(x).indexOf('i') === -1),
        default: this.value.weight || 400,
        required: true
      }
    },
    fontStyleSpec () {
      return {
        label: 'Style',
        enum: ['regular', 'italic'],
        default: this.value.style || 'regular',
        required: true
      }
    }
  },
  methods: {

    // Set state item
    setState (state) {
      this.state = Object.assign(this.state, state)
    },

    // Get the font class for a specific font family
    fontClass (fontFamily) {
      if (fontFamily) {
        return 'font-' + fontFamily.replace(/\s+/g, '-').toLowerCase()
      }
    },

    // Download the font previews for all visible font entries and the five after them
    onScroll (e) {
      const elementHeight = e.target.scrollHeight / this.fontManager.fonts.length;
      const downloadIndex = Math.ceil((e.target.scrollTop + e.target.clientHeight) / elementHeight)
      this.fontManager.downloadPreviews(downloadIndex + 5)
    },

    // Set the font with the given font list index as the active one
    setActiveFont (fontFamily) {
      const activeFontIndex = this.fontManager.setActiveFont(fontFamily)
      console.log('font input: set active', fontFamily, activeFontIndex)
      if (activeFontIndex === -1) {
        // error trying to change font
        this.setState({
          // activeFont: fontFamily,
          errorText: `Cannot update activeFont: The font "${fontFamily}" is not in the font list`,
          loadingStatus: 'error'
        })
      } else {
        // font change successful
        this.setState({
          // activeFont: fontFamily,
          errorText: '',
          loadingStatus: 'finished'
        })

        // download preview for active font
				this.fontManager.downloadPreviews(activeFontIndex)
      }
    },

    // Handle change event
    onChange (font) {
      const data = this.fontData(font)
      console.log('font changed', font, data)
      this.value = data
      this.setActiveFont(font.family)
      this.$emit('update', this.name, data)
    },

    fontData (font) {
      return {
        family: font.family,
        category: font.category,
        weight: this.value.weight,
        style: this.value.style,
        weights: Object.keys(font.files).map(x => {
          if (x === 'regular')
            return '400'
          if (x === 'italic')
            return '400i'
          return x.replace(/talic$/, '')
        })
      }
    }
  }
}
</script>

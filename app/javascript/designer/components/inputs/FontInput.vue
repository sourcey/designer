<template lang="pug">
.item-wrap.font-input
  //
    <br>name: >>>
    <br>{{name}}
    <br>spec: >>>
    <br>{{spec}}
    <br>object: >>>
    <br>{{object}}
  .form-group.form-row.align-items-center
    //- .no-gutters
    label.col-xl-4.col-form-label(:for="'input-' + name") {{ itemLabel(name, spec) }}
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
        button.form-control.dropdown-toggle.no-caret(@click.prevent='isShown = !isShown')
          span.font-name(:class='fontClass(activeFont)') {{activeFont}}
          span.spinner-border.spinner-border-sm.ml-05(v-if="state.loadingStatus === 'loading'", role='status', aria-hidden='true')
        .dropdown-menu.w-100(v-if="state.loadingStatus === 'finished' && fontManager.fonts" :class='{show: isShown}' @scroll='onScroll')
          a.dropdown-item(href='#', v-for='font in fontManager.fonts', :key='font.family', :class="[fontClass(font.family), {'active-font': font.family === activeFont}]", @click.prevent='onChange(font)') {{font.family}}
</template>

<script>
import { FontManager } from 'font-picker'
import { store } from '../../store'

export default {
  props: ['spec', 'name', 'item', 'parent', 'root'],
  data() {
    return {
      object: this.item,
      activeFont: this.item[this.name] ? this.item[this.name].family : null,
      isShown: false,
      state: {
        errorText: '',
        loadingStatus: 'loading' // possible values: 'loading', 'finished', 'error'
      },
      apiKey: store.state.googleFontsApiKey,
      options: {},
      fontManager: null,
    };
  },
  mounted() {

    // Initialize FontManager object and generate the font list
    this.fontManager = new FontManager(
      this.apiKey,
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
  // watch: {
  //   activeFont() {
  //     // if (this.activeFont !== this.activeFont) {
  //       this.setActiveFont(this.activeFont)
  //     // }
  //   },
  // },
  methods: {
    /**
     * Set state object
     */
    setState(state) {
      this.state = Object.assign(this.state, state)
    },

    /**
     * Get the font class for a specific font family
     */
    fontClass(fontFamily) {
      if (fontFamily) {
        return 'font-' + fontFamily.replace(/\s+/g, '-').toLowerCase()
      }
    },

    /**
     * Download the font previews for all visible font entries and the five after them
     */
    onScroll(e) {
      const elementHeight = e.target.scrollHeight / this.fontManager.fonts.length;
      const downloadIndex = Math.ceil((e.target.scrollTop + e.target.clientHeight) / elementHeight)
      this.fontManager.downloadPreviews(downloadIndex + 5)
    },

    /**
     * Set the font with the given font list index as the active one
     */
    setActiveFont(fontFamily) {
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
      this.activeFont = fontFamily
    },

    /**
     * Handle change event
     */
    onChange(font) {
      const data = this.fontData(font)
      console.log('font changed', font, data)
      this.object[this.name] = data
      this.setActiveFont(font.family)
      this.$emit('update', this.name, data)
    },

    fontData(font) {
      return {
        family: font.family,
        category: font.category,
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

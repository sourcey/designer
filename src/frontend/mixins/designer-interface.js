import Vue from 'vue'

// import Icon from '../../base/components/SvgIcon.vue'
import {
  // importThemeLayout,
  classify,
  randomString,
  mergeSpecDefaults
} from '../utils'


export default {
  // components: {
  //   Icon
  // },
  computed: {
    designerPage () {
      return this.$store.getters.designerPage //(this.$route.meta.id)
    },
    pageData () {
      if (!this.designerPage.data)
        this.$set(this.designerPage, 'data', {})
      return this.designerPage.data
    },

    // Populate element data with spec defaults so:
    // 1) elements will be rendered with defaults regardless of theme
    // 2) objects will be reactive for the designer
    // Used in elements/*.vue
    elementData () {
      if (!this.element)
        return {}
      if (!this.element.data)
        this.$set(this.element, 'data', {})

      // // if (section.layout) {
      //   const spec = this.$store.getters.designerElementSpec(this.element.name)
      //   // const layoutSpec = this.$store.getters.designerLayoutSpec(this.element.layout)
      //   mergeSpecDefaults(this.element, spec)
      // // }
      //
      // if (this.element.layout) {
      //   const layoutSpec = this.$store.getters.designerLayoutSpec(this.element.layout)
      //   mergeSpecDefaults(this.element, layoutSpec)
      // }
      // this.setElementDefaults(this.element) // FIXME
      return this.element.data
    },
    // dynamicSections () {
    //   // return this.designerPage.sections
    //   return this.designerPage.sections.map((section, index) => {
    //     if (!section.id)
    //       throw 'Invalid section data'
    //     // if (!section.instance)
    //     //   section.instance = this.sectionRenderer
    //     section.index = index
    //     return section
    //     // if (!section.id)
    //     //   section.id = randomString(8)
    //     // this.setSectionDefaults(section) // FIXME
    //     // if (section.layout) {
    //     //   const spec = this.$store.getters.designerLayoutSpec(section.layout)
    //     //   mergeSpecDefaults(section, spec)
    //     // }
    //     // return Object.assign({
    //     //   instance: this.sectionRenderer //(this.$store.state.site.theme_name, section.layout),
    //     //   // instance: importThemeLayout(this.$store.state.site.theme_name, section.layout),
    //     // }, section)
    //   })
    // },
    // dynamicElements () {
    //   return this.designerPage.elements.map(element => {
    //     if (!element.id)
    //       element.id = randomString(8)
    //     return Object.assign({
    //       instance: importThemeElement(this.$store.state.site.theme_name, element.name),
    //     }, element)
    //   })
    // },
    // pageContent () {
    //   return this.$route.meta.error ?
    //     () => import(/* webpackChunkName: "designer" */ '../components/ServerError.vue') :
    //     () => import(/* webpackChunkName: "core" */ '../components/renderers/PageRenderer.vue')
    // },
    // Used in layouts/*
    // Used in layouts/*
    // itemsRenderer () {
    //   return () => import(/* webpackChunkName: "core" */ '../components/renderers/ItemsRenderer.vue')
    //
    //   // return this.$store.state.designerEnabled && this.editing ?
    //   //   () => import(/* webpackChunkName: "designer" */ '@/base/components/renderers/ItemsRenderer.vue') :
    //   //   () => import(/* webpackChunkName: "core" */ '../components/renderers/ItemsRenderer.vue')
    // },
    // elementContainer () {
    //   return () => import(/* webpackChunkName: "core" */ '../components/renderers/ElementWrap.vue')
    //   // return this.$store.state.designerEnabled && this.editing ?
    //   //   () => import(/* webpackChunkName: "designer" */ '@/base/components/renderers/ElementWrap.vue') :
    //   //   () => import(/* webpackChunkName: "core" */ '../components/renderers/ElementWrap.vue')
    // },
    // elementRenderer () {
    //   return () => import(/* webpackChunkName: "core" */ '../components/renderers/ElementRenderer.vue')
    //   // return this.$store.state.designerEnabled ?
    //   //   () => import(/* webpackChunkName: "designer" */ '@/base/components/renderers/ElementRenderer.vue') :
    //   //   () => import(/* webpackChunkName: "core" */ '../components/renderers/ElementRenderer.vue')
    // },
    // layoutComponent () {
    //
    //
    //    // console.log('RELOADDDDD layoutComponent', this.layout)
    //   return importThemeLayout(this.$store.state.site.theme_name, this.layout) // || 'default'
    //   // return importThemeLayout(this.$store.state.site.theme_name, 'default')
    // },
    parentSection () {
      return this.parentComponent('SectionRenderer')
    },

    //
    // Designer methods
    //

    designerBackend () {
      return this.$store.getters.designerBackend
    },

    designerEnabled () {
      return this.$store.getters.designerEnabled && this.designerBackend
    },

    designerEditingSection () {
      if (this.designerEnabled && this.parentSection && this.parentSection.section)
        return this.$store.getters.isEditingSection(this.parentSection.section.id)
      return false
    }
  },
  methods: {
    toggleParentClass (flag, className) {
      if (flag)
        this.$parent.$el.classList.add(className)
      else
        this.$parent.$el.classList.remove(className)
    },

    loadCustomComponent (name, category) {
      const reference = {
        name: name,
        category: category,
        instance: null
      }
      this.$root.$emit('load-designer-component', reference)
      if (reference.instance)
        return reference.instance
      return false
    },

    // setSectionDefaults (section) {
    //   // if (!element.data)
    //   //   element.data = {}
    //
    //   // Merge values from layout spec if applicable
    //   // if (section.layout) {
    //   //   const spec = this.$store.getters.designerLayoutSpec(section.layout)
    //   //   if (spec.properties) {
    //   //     Object.keys(spec.properties).forEach(x => {
    //   //       if (typeof(section.data[x]) === 'undefined' && typeof(spec.properties[x].default) !== 'undefined') {
    //   //         // if (!section.data[x] && typeof(spec.properties[x].default) !== 'undefined')
    //   //         section.data[x] = spec.properties[x].default
    //   //       }
    //   //       // else if (!section.data[x])
    //   //       //   section.data[x] = null
    //   //     })
    //   //   }
    //   // }
    //
    //   return section
    // },
    // setElementDefaults (element) {
    //   if (!element.data)
    //     element.data = {}
    //
    //   // const spec = this.$store.getters.designerElementSpec(element.name)
    //   // if (spec) {
    //   //   if (spec.properties) {
    //   //     Object.keys(spec.properties).forEach(x => {
    //   //       if (typeof(element.data[x]) === 'undefined' && typeof(spec.properties[x].default) !== 'undefined') {
    //   //         element.data[x] = spec.properties[x].default
    //   //         // else if (!element.data[x])
    //   //         //   element.data[x] = null
    //   //       }
    //   //     })
    //   //   }
    //   //
    //   //   if (spec.children && (!element.children || !element.children.length)) {
    //   //     element.children = spec.children
    //   //   }
    //   // }
    //
    //   return element
    // },
    // formatMoney (value) {
    //   // TODO: use user locale
    //   const locale = this.$store.state.site.country || 'en-GB'
    //   const currency = this.$store.state.site.currency
    //   try {
    //     value = parseFloat(value)
    //     console.log('format currency', value)
    //     // if (locale)
    //       return value.toLocaleString(locale, { style: 'currency', currency: currency })
    //   // else
    //   //   return value.toLocaleString({ style: 'currency', currency: currency })
    //   } catch (e) {
    //     console.log('format currency failed', value, locale, currency, e)
    //     return value
    //   }
    // },
    // formatNumber (value) {
    //   // TODO: use user locale
    //   const locale = this.$store.state.site.country || 'en-GB'
    //   try {
    //     return value.toLocaleString(locale)
    //   } catch (e) {
    //     console.log('format currency failed', e)
    //     return value
    //   }
    // },

    // Used by ElementRenderer
    // importElement (type, editing) {
    //   // const componentName = `${classify(type)}Element`
    //   const spec = this.$store.getters.designerElementSpec(type)
    //
    //   return editing && spec && spec.override ?
    //     importDesignerElement(type) :
    //     importThemeElement(this.$store.state.site.theme_name, type)
    // },

    // TODO: move this to store getters
    // findElementData (elementId) {
    //   console.log('findElementData', this.designerPage)
    //   const found = this.designerPage.elements.find(element => element.id === elementId)
    //   if (!found)
    //     throw Error(`Element data not found for: ${elementId}`)
    //     // return {}
    //   if (!found.data)
    //     found.data = {}
    //   // console.log('get element data', found, elementId)
    //   return found.data //found ? found.data : {}
    // },
    // sitePath (path) {
    //   if (!path) path = '/'
    //   return path
    // },
    // siteUrl (path) {
    //   if (!path) path = '/'
    //   return this.$store.state.site.url + path
    // },
    // galleryPath (path) {
    //   // Same logic as router.js setPagePath
    //   const gallery = this.$store.state.site.pages.find(x => x.name === 'gallery')
    //   if (gallery)
    //     return this.sitePath(`${gallery.path}${path}`)
    //   else
    //     return `/listing${path}`
    // },
    // listingPath (listing) {
    //   return this.galleryPath(`/${listing.slug}`)
    // },
    // attachmentUrl (attachment, size) {
    //   if (attachment) {
    //     if (typeof attachment === 'string') {
    //       return attachment
    //     } else if (attachment.signed_id) {
    //       if (size) {
    //         return `${process.env.CDN_URL}/${attachment.signed_id}/${size}/${attachment.filename}`
    //       } else {
    //         return `${process.env.CDN_URL}/${attachment.signed_id}/${attachment.filename}`
    //       }
    //     } else if (attachment.asset) {
    //       return `/themes/${this.$store.state.site.theme_name}/assets/${attachment.asset}`
    //     } else if (attachment.url) {
    //       return attachment.url
    //     }
    //   }
    // },
    // dynamicComponent (componentName) {
    //   console.log('load dynamic component:', componentName)
    //   return () => import(`@/themes/${this.$store.state.theme_name}/components/${componentName}.vue`)
    // },
    // dynamicElementsFor (section) {
    //   return this.dynamicElements.filter(element => element.section === section)
    // },
    parentComponent (name) {
      let component = null
      let parent = this.$parent
      while (parent && !component) {
        if (parent.$options.name === name) {
          component = parent
        }
        parent = parent.$parent
      }
      return component
    },
  }
}

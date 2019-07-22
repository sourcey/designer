<template lang="pug">
#designer.designer-ui
  #designer-sidebar
    .designer-actions
      a.btn.btn-icon.text-primary(@click.prevent='saveResource' href='#' v-b-tooltip title="Save")
        i.fa.fa-save
      //- li.nav-object.flex-fill
      //- li.nav-item(v-if='designerBackendState.enableRefresh !== false')
      //-   a.nav-link(@click='refreshPreview' href='#' v-b-tooltip title="'Refresh Preview'")
      //-     i.fa.fa-sync
      //- li.nav-item
      //-   a.nav-link(@click='save' href='#' v-b-tooltip title="'Save'")
      //-     i.fa.fa-save
    b-tabs(nav-wrapper-class='designer-tabs')
      slot(name='tabs-start')
      //- b-tab(:title='$store.hasPages() ? "Pages" : "Elements"')
      b-tab(title='Page')
        spinner.mt-3(v-if='!designerBackendState.resource')
        section-form-list(v-else-if='designerBackendState.enableSections' :resource='designerBackendState.resource')
        element-form-list(v-else)
      b-tab(:title='form.label' :key='key' v-for='(form, key) in designerBackendState.spec.forms')
        spinner.mt-3(v-if='!designerBackendState.resource')
        component(v-else is='ResourceForm' :resource='designerBackendState.resource' :spec='form')
      b-tab(title='Gallery' v-if='designerBackendState.enableGallery')
        spinner.mt-3(v-if='!designerBackendState.resource')
        component(v-else is='MediaGallery')
      slot(name='tabs-end')
  preview-window(:url='designerBackendState.previewUrl')
</template>

<script>
import Vue from 'vue'
import PreviewWindow from './components/PreviewWindow'
import MediaGallery from './components/MediaGallery'
import ResourceForm from './components/ResourceForm'
import SectionFormList from './components/SectionFormList'
import ElementFormList from './components/ElementFormList'
import ElementForm from './components/ElementForm'
import Draggable from 'vuedraggable'
import { randomString } from '../designer/utils'

import './icons'
import './plugins/filters'
import './plugins/bootstrap'
import Globals from './mixins/globals'
import Backend from './mixins/backend'

Vue.mixin(Globals)
// Vue.mixin(Globals)


export default {
  components: {
    PreviewWindow,
    ResourceForm,
    SectionFormList,
    ElementFormList,
    ElementForm,
    Draggable,
    MediaGallery
  },
  mixins: [
    Backend
  ],
  beforeMount () {
    console.log('designer loaded', this.designerBackendState)
    // this.$store.sanitizeMetadata ()
    // this.$store.dispatch('sanitizeMetadata')

    // sanitizeMetadata: (state) => {
    //   if (!Array.isArray(state.content))
    //     return []
    //   return state.content.map(item => {
    //     if (!object.id)
    //       object.id = object.name + '-' + randomString(10)
    //
    //     // Ensure element templates exist
    //     if (object.name) {
    //       const found = this.getElementSpec(object.name)
    //       // const found = Object.values(vm.spec).find(function(definition) {
    //       //   return definition.template == object.template
    //       // })
    //       if (found) {
    //         return item
    //       } else {
    //         alert('No template exists for: ' + JSON.stringify(item))
    //         return null
    //       }
    //     } else {
    //       return item
    //     }
    //   }).filter(Boolean)
    // },
  },
  mounted () {
    this.designerBackendState.backendInterface = this

    // Create a watcher to listen for content changes.
    // Needs to be created after a timeout as it triggers on load
    // setTimeout(() => {
      this.$watch('designerBackendState.content', function(newValue, oldValue) {
        this.designerBackendState.unsaved = true
      }, { deep: true });
    // }, 100)
  },
  methods: {
    // save () {
    //   this.$store.dispatch('saveResource')
    //   // this.$store.saveResource(this)
    // },
    // restoreDefaults () {
    //   if (confirm("Are you sure? All existing page data will be lost.")) {
    //     const newPage = this.designerBackendStore.createPageData(this.page.name)
    //     resetObject(this.page, newPage)
    //     this.markUnsaved()
    //     // this.resetForm()
    //   }
    // },
  }
}
</script>

<style lang="scss">
// @import '@/assets/styles/frontend/_variables.scss';scoped
// @import './assets/styles/designer-vendor.scss';
@import './assets/styles/designer.scss';

html, body {
  height: 100%;
}

#navbar,
#footer {
  display: none;
}

#designer {
  // display: flex;
  // flex-direction: row;
  // width: 100%;
  height: 100%;
  height: 100vh;
  xtouch-action: none;

  // .panel-left {
  //   @include flex-shrink;
  //   width: 30%;
  //   // width: 33%;
  //   min-width: 400px;
  //   max-width: 500px;
  //   height: 100%;
  //   // min-height: 100vh;
  //   // max-height: 100vh;
  //   // overflow: visible;
  //   overflow-y: auto;
  //   overflow-x: visible;
  // }
  //
  // .splitter {
  //   flex: 0 0 auto;
  //   width: 2px;
  //   background: $gray-300;
  //   cursor: col-resize;
  // }
  //
  // .panel-right {
  //   // flex: 1 1 auto;
  //   @include flex-fill;
  //   width: 100%;
  //   height: 100%;
  // }

  //
  // == Preview iFrame

  #designer-preview {
    border: none;
  }

  //
  // == Sidebar

  #designer-sidebar {
    position: relative;
    background: $designer-background-color;
    width: $designer-sidebar-width;
    height: 100%;
    height: 100vh;

    * {
      // border: none !important;
      // box-shadow: none !important;
      outline: none !important;
    }

    .designer-actions {
      position: absolute;
      right: .4rem;
      top: .4rem;
    }

    .tabs {
      display: flex;
      flex-direction: column;
      height: 100%;

      .nav-tabs {
        background: theme-color-level('primary', -9);
        border-bottom-color: theme-color-level('primary', -6);
        // display: flex;

        .nav-item {
          margin-left: -1px;
          // @include flex-fill;
          text-align: center;

          &:first-child {
            margin-left: 0;
            .nav-link {
              border-left: 0;
            }
          }

          &:last-child {
            .nav-link {
              border-right: 0;
            }
          }
        }

        .nav-link {
          font-size: .9rem;
          font-weight: 600;
          border-radius: 0;
          border-top: 0;
          padding: .5rem $designer-section-padding-x;
          // border-color: theme-color-level('primary', -6);
          // color: theme-color-level('primary', -6);
          // theme-color-level($color, 6)
          // color: white;

          &:hover {
            border-color: transparent;
          }

          &:active,
          &.active {
            background-color: $designer-background-color;
            border-color: theme-color-level('primary', -6);
            border-bottom-color: $designer-background-color;
          }
        }
      }

      .tab-content {
        flex: 1 1 auto;
        position: relative;

        .tab-pane {
          @include fill-parent;
          overflow-y: auto;
        }
      }
    }
  }

  //
  // == Blocks

  .element-items {
    position: relative;
    padding: .5rem 0;
  }
}

</style>

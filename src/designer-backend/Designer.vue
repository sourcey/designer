<template lang="pug">
div#designer
  #designer-sidebar.panel-left
    .designer-actions
      a.btn.btn-icon.text-primary(@click.prevent='save' href='#' v-b-tooltip title="Save")
        i.fa.fa-save
    b-tabs(nav-wrapper-class='designer-tabs')
      slot(name='tabs-start')
      b-tab(:title='form.label' :key='key' v-for='(form, key) in designerBackendState.spec.forms')
        component(is='ResourceForm' :resource='designerBackendState.resource' :spec='form')
      //- b-tab(:title='$store.hasPages() ? "Pages" : "Elements"')
      b-tab(title='Elements')
        //- #designer-elements
        //- .tab-pane
        //- div {{ $store.hasPages() }}
        //- .pages(v-if='$store.hasPages()')
          header.form-header.pt-15
            .form-title My pages
            button.btn.btn-sm.btn-success(v-if='$store.hasCreatablePages()' @click='$store.createDefaultPage()')
              icon(name='plus')
              span Page
          //- div {{ metadata }}
          draggable.border-bottom-0(element='section' v-model='designerBackendState.metadata' :options="{handle:'.drag-page-handle'}" )
            component(:is="object.form || 'PageForm'"
                v-for='(item, index) in designerBackendState.metadata'
                :key='object.id' :object='object'
                :spec='$store.getters.getPageSpec(object.name)'
                @remove='removePage(item)')
        .elements.designer-ui
          //- (v-else)
          header.form-header.pt-15
            .form-title Page designer
            //- button.btn.btn-sm.btn-success(@click='createDefaultPage')
              icon(name='plus')
              | Page
            b-dropdown(variant='success' size='sm' no-caret)
              template(slot='button-content')
                icon(name='plus')
                span Element
                //- b-dropdown-header.form-header {{ sectionName }}
                //- b-dropdown-divider
              //- b-dropdown-item(v-for='(element, elementName) in designerBackendState.spec.elements'
                :key='elementName' @click='createElement(elementName)') {{ element.label }}
          //- div hiiiiiiiiiiiiiiii
          //- div {{ $store.getters.getElementSpec }}
          draggable.border-bottom-0(
              element='section',
              v-model='designerBackendState.metadata',
              :options="{handle:'.drag-element-handle'}")
            //- @change='onReorderElements'
            component(:is="element.form || 'ElementForm'",
                v-for='(element, index) in designerBackendState.metadata',
                :key='element.id',
                :object='element',
                :root='designerBackendState.metadata',
                :spec='$store.getters.getElementSpec(element.name)',
                :expanded='index === 0',
                @remove='removeElement(element)')
      b-tab(title='Gallery' v-if='designerBackendState.enableGallery')
        component(is='MediaGallery')
      slot(name='tabs-end')
        //- :attachment_upload_path='attachment_upload_path'
        //- #gallery.tab-pane.fade(aria-labelledby='gallery-tab' role='tabpanel')
        //- {{ hasPages ? &apos;Pages&apos; : &apos;Elements&apos;}}
    //- ul#designer-menu.nav.nav-tabs.pt-025(role='tablist')
      li.nav-item(:key='key' v-for='(form, key) in designerBackendState.spec.forms')
        a.nav-link(:href="'#' + key" data-toggle='tab' role='tab') {{ form.label }}
      li.nav-item
        a.nav-link(data-toggle='tab' href='#elements' role='tab') {{ hasPages ? &apos;Pages&apos; : &apos;Elements&apos;}}
      li.nav-item(v-if='designerBackendState.enableGallery !== false')
        a.nav-link(data-toggle='tab' href='#gallery' role='tab') Gallery
      li.nav-object.flex-fill
      li.nav-item(v-if='designerBackendState.enableRefresh !== false')
        a.nav-link(@click='refreshPreview' href='#' v-b-tooltip title="'Refresh Preview'")
          i.fa.fa-sync
      li.nav-item
        a.nav-link(@click='save' href='#' v-b-tooltip title="'Save'")
          i.fa.fa-save
    //- .tab-content
      .tab-pane.show.active(:id='key' :key='key' v-for='(form, key) in designerBackendState.spec.forms')
        component(:is="'ResourceForm'" :resource='designerBackendState.resource' :spec='form')
      #designer-elements.tab-pane
        .pages(v-if='hasPages')
          header.form-header.pt-15
            .form-title My pages
            button.btn.btn-sm.btn-success(@click='createDefaultPage' v-if='hasCreatablePages')
              icon(name='plus')
              | Page
          draggable(:options="{handle:'.drag-page-handle'}" element='section' v-model='designerBackendState.metadata')
            component(:is="object.form || 'PageForm'" :key='object.id' :object='object' :spec='getPageSpec(object.name)' v-for='(item, index) in designerBackendState.metadata' v-on:remove='removePage(item)')
      //- #gallery.tab-pane.fade(aria-labelledby='gallery-tab' role='tabpanel')
        component(is='MediaGallery' :attachment_upload_path='attachment_upload_path')
  //- .splitter
  //- iframe#designer-preview.panel-right(:src='designerBackendState.preview_url' height='100%' name='preview' ref='preview' width='100%')
  preview-window.panel-right(:url='designerBackendState.previewUrl')
</template>

<script>
import Vue from 'vue'
import PreviewWindow from './components/PreviewWindow'
import MediaGallery from './components/MediaGallery'
import ResourceForm from './components/ResourceForm'
import ElementForm from './components/ElementForm'
import Draggable from 'vuedraggable'
import { randomString } from '../designer/utils'

import './icons'
import './plugins/filters'
import './plugins/bootstrap'
import Globals from './mixins/globals'

Vue.mixin(Globals)


export default {
  components: {
    PreviewWindow,
    ResourceForm,
    ElementForm,
    Draggable,
    MediaGallery
  },
  beforeMount () {
    console.log('designer loaded', this.designerBackendState)
    // this.$store.sanitizeMetadata ()
    // this.$store.dispatch('sanitizeMetadata')

    // sanitizeMetadata: (state) => {
    //   if (!Array.isArray(state.metadata))
    //     return []
    //   return state.metadata.map(item => {
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

    // Create a watcher to listen for metadata changes.
    // Needs to be created after a timeout as it triggers on load
    // setTimeout(() => {
      this.$watch('designerBackendState.metadata', function(newValue, oldValue) {
        this.designerBackendState.unsaved = true
      }, { deep: true });
    // }, 100)
  },
  methods: {
    save () {
      this.$store.dispatch('saveResource')
      // this.$store.saveResource(this)
    }
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
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  height: 100vh;
  xtouch-action: none;

  .panel-left {
    @include flex-shrink;
    width: 30%;
    // width: 33%;
    min-width: 400px;
    max-width: 500px;
    height: 100%;
    // min-height: 100vh;
    // max-height: 100vh;
    // overflow: visible;
    overflow-y: auto;
    overflow-x: visible;
  }

  .splitter {
    flex: 0 0 auto;
    width: 2px;
    background: $gray-300;
    cursor: col-resize;
  }

  .panel-right {
    // flex: 1 1 auto;
    @include flex-fill;
    width: 100%;
    height: 100%;
  }

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

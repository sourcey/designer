<template lang="pug">
//- #app
div#designer
  #designer-sidebar.panel-left
    .designer-actions
      a.btn.btn-icon.text-primary(@click.prevent='save' href='#' v-b-tooltip title="Save")
        i.fa.fa-save
    b-tabs(nav-wrapper-class='designer-tabs')
      slot(name='tabs-start')
      b-tab(:title='form.label' :key='key' v-for='(form, key) in designerState.spec.forms')
        component(is="ResourceForm" :resource='designerState.resource' :spec='form')
      //- b-tab(:title='designerStore.hasPages() ? "Pages" : "Elements"')
      b-tab(title='Elements')
        //- #designer-elements
        //- .tab-pane
        //- div {{ designerStore.hasPages() }}
        //- .pages(v-if='designerStore.hasPages()')
          header.form-header.pt-15
            .form-title My pages
            button.btn.btn-sm.btn-success(v-if='designerStore.hasCreatablePages()' @click='designerStore.createDefaultPage()')
              i.fas.fa-plus
              span Page
          //- div {{ metadata }}
          draggable.border-bottom-0(element='section' v-model='designerState.metadata' :options="{handle:'.drag-page-handle'}" )
            component(:is="item.form || 'PageForm'"
                v-for='(item, index) in designerState.metadata'
                :key='item.id' :item='item'
                :spec='designerStore.getPageSpec(item.name)'
                @remove='removePage(item)')
        .elements
          //- (v-else)
          header.form-header.pt-15
            .form-title Page designer
            //- button.btn.btn-sm.btn-success(@click='createDefaultPage')
              i.fas.fa-plus
              | Page
            b-dropdown(variant='success' size='sm' no-caret)
              template(slot='button-content')
                i.fas.fa-plus
                span Element
                //- b-dropdown-header.form-header {{ sectionName }}
                //- b-dropdown-divider
              b-dropdown-item(v-for='(element, elementName) in designerState.spec.elements'
                :key='elementName' @click='createElement(elementName)') {{ element.label }}
          draggable.border-bottom-0(
              element='section',
              v-model='designerState.metadata',
              :options="{handle:'.drag-element-handle'}")
            //- @change='onReorderElements'
            component(:is="element.form || 'ElementForm'",
                v-for='(element, index) in designerState.metadata',
                :key='element.id',
                :item='element',
                :root='designerState.metadata',
                :spec='designerStore.getElementSpec(element.name)',
                :expanded='index === 0',
                @remove='removeElement(element)')
      b-tab(title='Gallery' v-if='designerState.enableGallery')
        component(is='MediaGallery')
      slot(name='tabs-end')
        //- :attachment_upload_path='attachment_upload_path'
        //- #gallery.tab-pane.fade(aria-labelledby='gallery-tab' role='tabpanel')
        //- {{ hasPages ? &apos;Pages&apos; : &apos;Elements&apos;}}
    //- ul#designer-menu.nav.nav-tabs.pt-025(role='tablist')
      li.nav-item(:key='key' v-for='(form, key) in designerState.spec.forms')
        a.nav-link(:href="'#' + key" data-toggle='tab' role='tab') {{ form.label }}
      li.nav-item
        a.nav-link(data-toggle='tab' href='#elements' role='tab') {{ hasPages ? &apos;Pages&apos; : &apos;Elements&apos;}}
      li.nav-item(v-if='designerState.enableGallery !== false')
        a.nav-link(data-toggle='tab' href='#gallery' role='tab') Gallery
      li.nav-item.flex-fill
      li.nav-item(v-if='designerState.enableRefresh !== false')
        a.nav-link(@click='refreshPreview' href='#' v-b-tooltip title="'Refresh Preview'")
          i.fa.fa-sync
      li.nav-item
        a.nav-link(@click='save' href='#' v-b-tooltip title="'Save'")
          i.fa.fa-save
    //- .tab-content
      .tab-pane.show.active(:id='key' :key='key' v-for='(form, key) in designerState.spec.forms')
        component(:is="'ResourceForm'" :resource='designerState.resource' :spec='form')
      #designer-elements.tab-pane
        .pages(v-if='hasPages')
          header.form-header.pt-15
            .form-title My pages
            button.btn.btn-sm.btn-success(@click='createDefaultPage' v-if='hasCreatablePages')
              i.fas.fa-plus
              | Page
          draggable(:options="{handle:'.drag-page-handle'}" element='section' v-model='designerState.metadata')
            component(:is="item.form || 'PageForm'" :key='item.id' :item='item' :spec='getPageSpec(item.name)' v-for='(item, index) in designerState.metadata' v-on:remove='removePage(item)')
      //- #gallery.tab-pane.fade(aria-labelledby='gallery-tab' role='tabpanel')
        component(is='MediaGallery' :attachment_upload_path='attachment_upload_path')
  .splitter
  iframe#designer-preview.panel-right(:src='designerState.preview_url' height='100%' name='preview' ref='preview' width='100%')
</template>

<script>
import Vue from 'vue'
import MediaGallery from './components/MediaGallery'
import ResourceForm from './components/ResourceForm'
// import PageForm from './components/PageForm'
import ElementForm from './components/ElementForm'
import Draggable from 'vuedraggable'
import './plugins/filters'
import './plugins/bootstrap'
import Globals from './mixins/globals'
import { randomString } from './utils'

Vue.mixin(Globals)


export default {
  components: {
    ResourceForm, ElementForm, Draggable, MediaGallery
  },
  beforeMount() {
    this.designerStore.verifyMetadata()
  },
  created () {

    // Create a watcher to listen for metadata changes.
    // Needs to be created after a timeout as it triggers on load
    setTimeout(() => {
      this.$watch('designerState.metadata', function(newValue, oldValue) {
        this.designerState.unsaved = true
      }, { deep: true });
    }, 100)
  },
  methods: {
    save () {
      this.designerStore.saveResource(this)
    }
  }
}
</script>

<style scoped lang="scss">
</style>

<template>
  <form v-bind:id="itemId(item)" class="block-form" v-on:dragstart="onDragElement">
    <!-- <div class="card block-card"> -->
      <!-- <div class="card-header d-flex align-items-center drag-block-handle"> -->
      <div class="section-header drag-block-handle">
        <a @click.prevent="showForm = !showForm" href="#" class="title">{{ item.title || spec.label }}</a>
         <!-- px-0 flex-fill text-left -->
        <!-- <input type="checkbox" class="mr-3" :checked="!item.hidden" @change="item.hidden = !item.hidden"> -->

        <div class="dropdown">
          <button data-toggle="dropdown" type="button" class="btn btn-sm btn-secondary dropdown-toggle"></button>
          <div class="dropdown-menu">
            <a href="#" class="dropdown-item" @click.prevent="selectPreviewBlock(item.id)">Preview</a>
            <a href="#" class="dropdown-item" @click="copyToClipboard(getEmbedCode(item.id))">Copy embed code</a>
            <a href="#" class="dropdown-item" @click="$emit('remove')">Delete</a>
          </div>
        </div>

      </div>
      <section class="block-items" v-show="showForm">
        <div class="section-item" v-for="(property, name) in spec.properties" :key="property.name">
          <!--
          data-toggle="collapse"
          v-bind:data-target="'#collapse-block-' + itemId(item)"
           v-bind:id="'collapse-block-' + itemId(item)"
          <br>property: -------------------------
          {{property}}
          <br>item: >>>
          <br>{{item}}
          <br>itemData: >>>
          <br>{{itemData}}-->
          <SortableArrayInput
            v-if="property.type === 'array' && property.properties"
            v-bind:item="itemData"
            v-bind:spec="property">
          </SortableArrayInput>
          <ImageInput
            v-else-if="property.type === 'image' || property.type === 'image_array'"
            v-bind:name="name"
            v-bind:item="itemData"
            v-bind:spec="property">
          </ImageInput>
          <StandardInput
            v-else
            v-bind:name="name"
            v-bind:item="itemData"
            v-bind:spec="property"></StandardInput>
        </div>
      </section>
    <!-- </div> -->
  </form>
</template>

<script>
import StandardInput from './StandardInput.vue'
import ImageInput from './ImageInput.vue'
import SortableArrayInput from './SortableArrayInput.vue'

export default {
  props: ['item', 'spec'],
  components: {
    StandardInput, ImageInput, SortableArrayInput
  },
  data() {
    return {
      showForm: false,
      itemData: this.item && this.item.data ? this.item.data : {}
    }
  },
  created() {
    console.log('BlockForm', this, this.item, this.spec)
  },
  methods: {
    onDragElement(event) {
      console.log('onDragElement', event, this)
      event.dataTransfer.setData('id', this.item.id)
      event.dataTransfer.setData('embed', this.getEmbedCode(this.item.id))
    }
  }
}
</script>

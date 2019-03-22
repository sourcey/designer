<template>
  <form v-bind:id="itemId(item)" v-on:dragstart="onDragElement">
    <!-- <br>item: -------------------------
    <br>{{item}} -->
    <!-- <section> -->
      <div class="section-header drag-page-handle">
        <!-- <a data-toggle="collapse" href="#" v-bind:data-target="'#collapse-page-' + itemId(item)" class="title px-0 flex-fill text-left">{{ item.title || spec.label }}</a> -->
        <a @click.prevent="showForm = true" href="#" class="title">{{ item.title || spec.label }}</a>
        <button @click.prevent="showForm = false" class="btn btn-sm btn-danger-icon"><i class="far fa-times-circle"></i></button>
         <!-- btn-danger btn-close -->
         <!-- px-0 flex-fill text-left -->
        <!-- <input type="checkbox" class="mr-3" :checked="!item.hidden" @change="item.hidden = !item.hidden"> -->
        <!-- <div class="dropdown">
          <button data-toggle="dropdown" type="button" class="btn btn-sm btn-secondary dropdown-toggle"></button>
          <div class="dropdown-menu">
            <a href="#" class="dropdown-item" @click="copyToClipboard(getEmbedCode(item.id))">Copy embed code</a>
            <a href="#" class="dropdown-item" @click="$emit('remove')">Delete</a>
          </div>
        </div> -->
      </div>
    <!-- </section> -->
      <!-- <div v-bind:id="'collapse-page-' + itemId(item)" class="collapse"> -->
    <div v-bind:class="['slidein-form', {'show': showForm}]">
      <header class="pt-15">
        <!-- <a @click.prevent="showForm = false" href="#" class="back"><i class="fas fa-arrow-left"></i></a> -->
        <h1>Editing page</h1>
        <!-- <button @click.prevent="showForm = false" class="btn btn-sm btn-danger btn-close"><i class="fas fa-times"></i></button> -->
        <!-- <button @click.prevent="showForm = false" class="btn btn-sm btn-danger btn-text">Close</button> -->
         <!-- class="btn btn-link" -->
        <a @click.prevent="showForm = false" href="#">Close</a>
      </header>

      <!-- <div > -->
        <!--
        <br>property: -------------------------
        {{property}}
        <br>item: >>>
        <br>{{item}}
        <br>itemData: >>>
        <br>{{itemData}} -->

      <header class="pt-1">
        <h2>Settings</h2>
        <!-- <button @click.prevent="showForm = false" class="btn btn-close btn-danger">x</button> -->
      </header>
      <section>
        <StandardInput
          v-for="(property, name) in spec.properties" :key="property.name"
          v-bind:name="name"
          v-bind:item="itemData"
          v-bind:spec="property"></StandardInput>
      </section>

      <div v-for="(section, sectionName) in spec.sections" :key="sectionName">
        <!-- <br>section: -------------------------
        <br>{{name}} -->

        <header class="pt-2">
          <h2>{{sectionName}}</h2>
          <!-- <button class="btn btn-sm btn-success"><i class="fas fa-plus"></i></button> -->

          <div class="dropdown">
            <button data-toggle="dropdown" type="button" class="btn btn-sm btn-success dropdown-toggle no-caret"><i class="fas fa-plus"></i></button>
            <div class="dropdown-menu">
              <a class="dropdown-item"
                v-for="blockName in section"
                @click="addPageBlock(blockName, sectionName)" href="#">{{ getBlockSpec(blockName).label }}</a>
            </div>
          </div>
        </header>
        <Draggable v-if="sectionBlocks[sectionName]"
          v-model="sectionBlocks[sectionName]"
          element="section"
          :options="{handle:'.drag-block-handle'}">
          <!-- draggable:'.block-form',  -->
          <!-- <section> -->
            <component
              :is="block.form || 'BlockForm'"
              v-for="(block, index) in sectionBlocks[sectionName]" :key="block.id"
              v-bind:item="block"
              v-bind:spec="getBlockSpec(block.name)"
              v-on:remove="item.blocks.splice(index, 1)"></component>
          <!-- </section> -->
        </Draggable>
        <p v-else class="no-data">No blocks have been added yet.</p>
        <!---->
      </div>

      <!-- <header>
        <h2>Blocks</h2>
      </header>
      <section>
        <component
          :is="block.form || 'BlockForm'"
          v-for="(block, index) in itemBlocks" :key="block.name"
          v-bind:item="block"
          v-bind:spec="getBlockSpec(block.name)"
          v-on:remove="item.blocks.splice(index, 1)"></component>
      </section> -->

            <!--
            <br>{{spec}}
            <div class="card-body" v-for="(section, name) in spec.sections" :key="name">
              <br>section: -------------------------
              <br>{{item}} -->
              <!--
              <br>property: -------------------------
              {{property}}
              <br>item: >>>
              <br>{{item}}
              <br>itemData: >>>
              <br>{{itemData}}
              <SortableArrayInput
                v-if="property.type == 'array' && property.properties"
                v-bind:item="itemData"
                v-bind:spec="property">
              </SortableArrayInput>
              <StandardInput
                v-else
                v-bind:name="name"
                v-bind:item="itemData"
                v-bind:spec="property"></StandardInput> -->
      <!-- <br>spec: -------------------------
      <br>{{spec}} -->
      <!-- <div class="card section-card" v-for="(section, name) in spec.sections" :key="name">
        <div class="card-header drag-section-handle">
          <a data-toggle="collapse" href="#" v-bind:data-target="'#collapse-section-' + itemId(section)" class="title px-0 flex-fill text-left">{{ name }}</a> -->

          <!-- <input type="checkbox" class="mr-3" :checked="!item.hidden" @change="item.hidden = !item.hidden">
          <div class="dropdown">
            <button data-toggle="dropdown" type="button" class="btn btn-sm btn-secondary dropdown-toggle"></button>
            <div class="dropdown-menu">
              <a href="#" class="dropdown-item" @click="copyToClipboard(getEmbedCode(item.id))">Copy embed code</a>
              <a href="#" class="dropdown-item" @click="$emit('remove')">Delete</a>
            </div>
          </div> -->
        <!-- </div>
        <div v-bind:id="'collapse-section-' + itemId(section)" class="collapse"> -->
          <!-- Draggable v-model="metadata" :options="{handle:'.drag-handle'}" -->
        <!-- </div>
      </div> -->

    </div>
  </form>
</template>

<script>
import StandardInput from './StandardInput.vue'
import SortableArrayInput from './SortableArrayInput.vue'
import BlockForm from './BlockForm.vue'
import Draggable from 'vuedraggable'

export default {
  props: ['item', 'spec'],
  components: {
    StandardInput, SortableArrayInput, BlockForm, Draggable
  },
  data() {
    return {
      showForm: false,
      itemBlocks: this.item && this.item.blocks ? this.item.blocks : [],
      itemData: this.item && this.item.data ? this.item.data : {},
      sectionBlocks: {}
    }
  },
  created() {
    console.log('PageForm', this, this.item, this.spec)
    // alert(this.item)
    this.initSectionBlocks()
  },
  // computed: {
  //   sectionBlocks () {
  //     let blocks = {}
  //     this.item.blocks.forEach(block => {
  //       if (!blocks[block.section])
  //         blocks[block.section] = []
  //       blocks[block.section].push(block)
  //     })
  //     return blocks
  //   }
  // },
  methods: {
    onDragElement(event) {
      console.log('onDragElement', event, this)
      event.dataTransfer.setData('id', this.item.id)
      event.dataTransfer.setData('embed', this.getEmbedCode(this.item.id))
    },
    initSectionBlocks() {
      // let blocks = {}
      this.itemBlocks.forEach(block => {
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$', block)
        this.addSectionBlock(block)
        // if (!this.sectionBlocks[block.section])
        //   this.sectionBlocks[block.section] = []
        // this.sectionBlocks[block.section].push(block)
      }, this)
      // return blocks
    },
    addSectionBlock(block) {
      if (!this.sectionBlocks[block.section])
        this.sectionBlocks[block.section] = []
      this.sectionBlocks[block.section].push(block)
      // this.$set(this.sectionBlocks, block.section, {block})
      this.$forceUpdate()
      console.log('addSectionBlock', block.section, block, this.sectionBlocks[block.section])
    },
    addPageBlock(blockName, sectionName) {
      const block = this.createBlockData(blockName, sectionName)
      this.itemBlocks.push(block)
      this.addSectionBlock(block)
    }
  }
}
</script>

<!-- <style>
</style> -->

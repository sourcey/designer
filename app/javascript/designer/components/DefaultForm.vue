<template>
  <form v-bind:id="item.id" v-on:dragstart="onDragElement">
    <div class="card">
      <div class="card-header d-flex align-items-center drag-handle">
        <a data-toggle="collapse" href="#" v-bind:data-target="'#collapse-' + item.id" class="title px-0 flex-fill text-left">{{ item.title || spec.label }}</a>
        <input type="checkbox" class="mr-3" :checked="!item.hidden" @change="item.hidden = !item.hidden">
        <div class="dropdown">
          <button data-toggle="dropdown" type="button" class="btn btn-sm btn-secondary dropdown-toggle"></button>
          <div class="dropdown-menu">
            <a href="#" class="dropdown-item" @click="copyToClipboard(getEmbedCode(item.id))">Copy embed code</a>
            <a href="#" class="dropdown-item" @click="$emit('remove')">Delete</a>
          </div>
        </div>
      </div>
      <div v-bind:id="'collapse-' + item.id" class="collapse">
        <div class="card-body" v-for="(property, name) in spec.properties" :key="property.name">
          <!--
          <br>property: -------------------------
          {{property}}
          <br>item: >>>
          <br>{{item}}
          <br>object: >>>
          <br>{{object}} -->
          <SortableInputArray
            v-if="property.type == 'array' && property.properties"
            v-bind:item="object"
            v-bind:spec="property">
          </SortableInputArray>
          <DefaultInput
            v-else
            v-bind:name="name"
            v-bind:item="object"
            v-bind:spec="property"></DefaultInput>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import DefaultInput from './DefaultInput.vue'
import SortableInputArray from './SortableInputArray.vue'

export default {
  props: ['item', 'spec'],
  components: {
    DefaultInput, SortableInputArray
  },
  data() {
    return {
       object: this.item && this.item.values ? this.item.values : {}
    }
  },
  created() {
    console.log('DefaultForm', this, this.item, this.spec)
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

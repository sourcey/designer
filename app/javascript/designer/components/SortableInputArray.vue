<template>
  <Draggable v-model="object" :options="{handle:'.drag-handle-child'}" @update="onUpdate">
    <div class="section-heading d-flex align-items-center">
      <div class="title flex-fill">{{ spec.label || spec.name }}</div>
      <a class="btn btn-sm btn-success mr-2 my-2" @click.prevent="object.push({})" href="#">Add</a>
    </div>
    <div class="card child" v-for="(data, index) in object">
      <div class="card-header drag-handle-child">
        <a class="btn btn-sm float-right" @click.prevent="object.splice(index, 1)" href="#"><i class="fa fa-trash"></i></a>
        <a class="title" data-toggle="collapse" v-bind:data-target="'#collapse-' + index" href="#">
          <span v-if="data.title">{{ data.title }}</span>
          <span v-else-if="data.label">{{ data.label }}</span>
          <span v-else-if="data.id">Item {{ data.id }}</span>
          <span v-else>Item {{ index }}</span>
        </a>
      </div>
      <div v-bind:id="'collapse-' + index" class="collapse card-body" @change="onUpdate">
        <!--
        <br>data ###########################
        {{data}}
        <br>item ###########################
        {{item}}
        <br>object ###########################
        {{object}}-->
        <DefaultInput
          v-for="(property, name) in spec.properties"
          :key="property.name"
          v-bind:name="name"
          v-bind:item="data"
          v-bind:spec="property"></DefaultInput>
      </div>
    </div>
  </Draggable>
</template>

<script>
import DefaultInput from './DefaultInput.vue'
import Draggable from 'vuedraggable'

export default {
  props: {
    item: {
      type: Object
    },
    scope: {
      default: 'items',
      type: String
    },
    spec: {
      type: Object
    }
  },
  components: {
    DefaultInput, Draggable
  },
  created() {
    // console.log('SortableInputArray', this, this.object, this.scope, this.spec)
  },
  data() {
    return {
      id: this.randomString(10),
      object: this.item && this.item[this.scope] ? this.item[this.scope] : []
    }
  },
  methods: {
    onUpdate() {
      // console.log('FormList onUpdate', this)

      // FIXME: This is evil, but can't seem to to trigger the right event
      this.$set(this.$parent.item.values, this.scope, this.object)
    }
  }
}
</script>

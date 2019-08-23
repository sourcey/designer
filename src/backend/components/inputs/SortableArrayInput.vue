<template lang="pug">
draggable(v-on='$listeners' v-model='object' :options="{handle:'.drag-handle-child'}" @update='onUpdate')
  .section-heading.d-flex.align-items-center
    .title.flex-fill {{ label || name }}
    a.btn.btn-sm.btn-success.mr-2.my-2(@click.prevent='object.push({})' href='#') Add
  .card.child(v-for='(data, index) in object')
    .card-header.drag-handle-child
      a.btn.btn-sm.float-right(@click.prevent='object.splice(index, 1)' href='#')
        i.fa.fa-trash
      a.title(data-toggle='collapse' :data-target="'#collapse-' + index" href='#')
        span(v-if='data.title') {{ data.title }}
        span(v-else-if='data.label') {{ data.label }}
        span(v-else-if='data.id') Item {{ data.id }}
        span(v-else='') Item {{ index }}
    .collapse.card-body(:id="'collapse-' + index", @change='onUpdate')
      dynamic-input(v-for='(property, index) in properties' :key='property.name' :object='data' :spec='property')
</template>

<script>
import Input from '../../mixins/input'
import DynamicInput from '../DynamicInput.vue'
import Draggable from 'vuedraggable'


export default {
  extends: Input,
  // props: {
  //   item: {
  //     type: Object
  //   },
  //   name: {
  //     default: 'items',
  //     type: String
  //   },
  //   spec: {
  //     type: Object
  //   }
  // },
  components: {
    DynamicInput,
    Draggable
  },
  created() {
    // console.log('SortableArrayInput', this, this.object, this.name, this.spec)
  },
  data () {
    return {
      // id: this.randomString(10),
      object: this.model && this.model[this.name] ? this.model[this.name] : []
    }
  },
  methods: {
    onUpdate() {
      // console.log('FormList onUpdate', this)

      // FIXME: This is evil, but can't seem to to trigger the right event
      this.$set(this.$parent.object.values, this.name, this.object)
    }
  }
}
</script>

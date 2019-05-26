<template lang="pug">
draggable(v-on='$listeners', v-model='object', :options="{handle:'.drag-handle-child'}", @update='onUpdate')
  .section-heading.d-flex.align-items-center
    .title.flex-fill {{ spec.label || spec.name }}
    a.btn.btn-sm.btn-success.mr-2.my-2(@click.prevent='object.push({})', href='#') Add
  .card.child(v-for='(data, index) in object')
    .card-header.drag-handle-child
      a.btn.btn-sm.float-right(@click.prevent='object.splice(index, 1)', href='#')
        i.fa.fa-trash
      a.title(data-toggle='collapse', :data-target="'#collapse-' + index", href='#')
        span(v-if='data.title') {{ data.title }}
        span(v-else-if='data.label') {{ data.label }}
        span(v-else-if='data.id') Item {{ data.id }}
        span(v-else='') Item {{ index }}
    .collapse.card-body(:id="'collapse-' + index", @change='onUpdate')
      //
        <br>data ###########################
        {{data}}
        <br>item ###########################
        {{item}}
        <br>object ###########################
        {{object}}
      dynamic-input(v-for='(property, index) in spec.properties' :key='property.name' :item='data' :spec='property')
</template>

<script>
import DynamicInput from '../DynamicInput.vue'
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
    DynamicInput,
    Draggable
  },
  created() {
    // console.log('SortableArrayInput', this, this.object, this.scope, this.spec)
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

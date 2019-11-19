<template lang="pug">
draggable(v-on='$listeners' v-model='currentValue' :options="{handle:'.drag-child-handle'}" @update='onUpdate')
  //- .section-heading.d-flex.align-items-center.flex-fill
  header
    .title.text-secondary.small.semibold.py-075 {{ inputLabel }}
    a.btn.btn-sm.btn-success(@click.prevent='currentValue.push({})' href='#') Add
    //- .mr-2.my-2
  .collapsible(v-for='(data, index) in currentValue' :class="{expand: index === showIndex}")
    //- div {{showIndex}}

    .item-handle.secondary
      a.title(@click.prevent='toggleIndex(index)' href='#')
        span(v-if='data && data.title') {{ data.title }}
        span(v-else-if='data && data.label') {{ data.label }}
        span(v-else-if='data && data.id') Item {{ data.id }}
        span(v-else='') Item {{ index }}
      .actions
        button.drag-handle.drag-child-handle.btn.btn-icon.btn-text-secondary(@click.prevent)
          icon(name='move-v')
        button.drag-handle.drag-child-handle.btn.btn-icon.btn-text-secondary(@click.prevent='currentValue.splice(index, 1)')
          icon(name='trash')
        //- a.btn.btn-sm.float-right(@click.prevent='currentValue.splice(index, 1)' href='#')
        //-   i.fa.fa-trash.card-body
    .item-wrap.collapse-content
      //- .collapse(:id="'collapse-' + index")
      //- @change='onUpdate'
      dynamic-input(v-for='(property, name) in properties' :key='name' :name='name' :object='data' :spec='property')
</template>

<script>
import Input from '../../mixins/input'
import DynamicInput from '../DynamicInput.vue'
import Draggable from 'vuedraggable'


export default {
  extends: Input,
  props: {
    properties: {
      type: Object
    },
    // name: {
    //   default: 'items',
    //   type: String
    // },
    // spec: {
    //   type: Object
    // }
  },
  components: {
    DynamicInput,
    Draggable
  },
  data () {
    return {
      showIndex: 0
    }
  },
  created () {
    if (!this.currentValue)
      this.currentValue = []
    // console.log('SortableArrayInput', this, this.object, this.name, this.spec)
  },
  // data () {
  //   return {
  //     // id: this.randomString(10),
  //     object: this.model && this.model[this.name] ? this.model[this.name] : []
  //   }
  // },
  methods: {
    toggleIndex (index) {
      if (index === this.showIndex)
        this.showIndex = null
      else
        this.showIndex = index
    },
    onUpdate() {
      // console.log('FormList onUpdate', this)

      // FIXME: This is evil, but can't seem to to trigger the right event
      // this.$set(this.$parent.object.values, this.name, this.object)
    }
  }
}
</script>

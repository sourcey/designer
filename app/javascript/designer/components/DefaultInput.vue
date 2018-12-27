<template>
  <div class="w-100">
    <div v-if="spec.type == 'string' && spec.multiline" class="form-group">
      <a href="#" @click="openMarkdownEditor('#textarea-' + object.id)" class="float-right"><i class="fa fa-edit"></i></a>
      <label :for="'textarea-' + object.id" class="control-label">{{ spec.label || name | titleize }}</label>
      <textarea :id="'textarea-' + object.id" v-model="object[name]" :placeholder="spec.placeholder" @change="$emit('change')" rows="5" class="form-control"></textarea>

      <!-- <div class="col-sm-3 col-form-label">
        {{ spec.label || name | titleize }}
        <small><a href="#" @click="openMarkdownEditor('#textarea-' + object.id)">Editor</a></small>
      </div>
      <div class="col-sm-9">
        <textarea :id="'textarea-' + object.id" :type="spec.type" v-model="object[name]" :placeholder="spec.placeholder" @change="$emit('change')" class="form-control"></textarea>
      </div> -->
    </div>
    <div v-else-if="spec.type == 'array'" class="form-group form-row">
      <label class="col-sm-3 col-form-label">{{ spec.label || name | titleize }}</label>
      <div class="col-sm-9">
        <tags-input element-id="tags"
          v-model="object[name]"
          :existing-tags="tagArrayToObject(spec.enum)"
          :typeahead="true"
          :typeahead-activation-threshold="0"
          :only-existing-tags="!spec.custom"></tags-input>
      </div>
    </div>
    <div v-else-if="spec.enum" class="form-group form-row">
      <label class="col-sm-3 col-form-label">{{ spec.label || name | titleize }}</label>
      <div class="col-sm-9">
        <select v-model="object[name]" class="form-control">
          <option value="">Please select one</option>
          <option v-for="(value, index) in spec.enum">{{ value }}</option>
        </select>
      </div>
    </div>
    <div v-else-if="spec.type == 'boolean'" class="form-check">
      <input type="checkbox" value="true" :id="name" v-model="object[name]" @change="$emit('change')" class="form-check-input">
      <label class="form-check-label" :for="name">{{ spec.label || name | titleize }}</label>
    </div>
    <div v-else class="form-group form-row">
      <label class="col-sm-3 col-form-label">{{ spec.label || name | titleize }}</label>
      <div class="col-sm-9">
        <input :type="spec.type" v-model="object[name]" :placeholder="spec.placeholder" class="form-control">
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue/dist/vue.esm.js'
import VoerroTagsInput from '@voerro/vue-tagsinput'
// import Helpers from  '../helpers'

Vue.component('tags-input', VoerroTagsInput)

export default {
  props: ['spec', 'name', 'item'],
  components: {
    VoerroTagsInput
  },
  data() {
    return {
       object: this.item || {}
    }
  },
  // beforeMount() {
  //   // console.log('DefaultInput', this.object, this.spec.default)
  //   // this.object[this.name] = this.object[this.name] || this.spec.default
  // },
  // created() {
  //   console.log('DefaultInput', this, this.spec, this.name, this.item)
  // },
  methods: {
    tagArrayToObject(tags) {
      return tags.reduce((acc, cur, i) => {
        acc[cur] = cur
        return acc
      }, {})
    }
  }
}
</script>

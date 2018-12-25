<template>
  <div class="w-100">
    <div v-if="spec.type == 'string' && spec.multiline" class="form-group form-row">
      <label class="col-sm-3 col-form-label">{{ spec.label || name | titleize }}</label>
      <div class="col-sm-9">
        <textarea :type="spec.type" v-model="object[name]" :placeholder="spec.placeholder" @change="$emit('change')" class="form-control"></textarea>
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
export default {
  props: ['spec', 'name', 'item'],
  data() {
    return {
       object: this.item || {}
    }
  },
  beforeMount() {
    console.log('DefaultInput', this.object, this.spec.default)
    // this.object[this.name] = this.object[this.name] || this.spec.default
  },
  // created() {
  //   console.log('DefaultInput', this, this.spec, this.name, this.item)
  // },
}
</script>

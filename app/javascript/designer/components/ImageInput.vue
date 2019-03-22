<template>
  <div class="item-wrap image-input">
    <!-- {{ object }} -->
    <br>name: >>>
    <br>{{name}}
    <br>object: >>>
    <br>{{object}}
    <br>spec: >>>
    <br>{{spec}}
    <div v-if="spec.type == 'image_array'" class="form-group image-array-input">
      <label :for="name + '-input'">{{ spec.label || name | titleize }}</label>

      <!-- <div class="file-input"> -->
        <input type="file" multiple :name="name" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
          accept="image/*" class="input-file">
          <!-- Add -->
          <!-- :disabled="isSaving"  -->
          <!-- <p v-if="isInitial">
            Drag your file(s) here to begin<br> or click to browse
          </p>
          <p v-if="isSaving">
            Uploading {{ fileCount }} files...
          </p> -->
      <!-- </div> -->
      <div class="preview-items">
        <div v-for="(file, index) in uploadedFiles" class="image-item">
          <!-- {{ file.name }} -->
          <div v-if="file.state == 'uploading'" class="image-loader spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <div v-if="file.state == 'uploading'" class="image-error" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <span v-else class="btn btn-danger-icon image-delete" v-on:click="removeFile(file)"><i class="far fa-times-circle"></i></span>
          <!-- <div v-if="file.error" class="error">{{ file.error }}</div> -->
          <img v-if="file.url" :src="file.url" />
        </div>
      </div>




      <!-- <input type="file" v-model="object[name]" :placeholder="spec.placeholder" class="form-control-file"> -->
      <!-- <a href="#" @click="openMarkdownEditor('#textarea-' + object.id)" class="float-right"><i class="fa fa-edit"></i></a>
      <label :for="'textarea-' + object.id" class="control-label">{{ spec.label || name | titleize }}</label>
      <textarea :id="'textarea-' + object.id" v-model="object[name]" :placeholder="spec.placeholder" @change="$emit('change')" rows="5" class="form-control"></textarea> -->

      <!-- <div class="col-sm-3 col-form-label">
        {{ spec.label || name | titleize }}
        <small><a href="#" @click="openMarkdownEditor('#textarea-' + object.id)">Editor</a></small>
      </div>
      <div class="col-sm-9">
        <textarea :id="'textarea-' + object.id" :type="spec.type" v-model="object[name]" :placeholder="spec.placeholder" @change="$emit('change')" class="form-control"></textarea>
      </div> -->
    </div>
    <div v-else-if="spec.type == 'image'" class="form-group form-row">
      <!-- <label :for="name + '-input'">{{ spec.label || name | titleize }}</label> -->
      <!-- <tags-input element-id="tags"
        v-model="object[name]"
        :existing-tags="tagArrayToObject(spec.enum)"
        :typeahead="true"
        :typeahead-activation-threshold="0"
        :only-existing-tags="!spec.custom"></tags-input> -->
    </div>
  </div>
</template>

<script>
// import Vue from 'vue/dist/vue.esm.js'
// import VoerroTagsInput from '@voerro/vue-tagsinput'
// import Helpers from  '../helpers'

// Vue.component('tags-input', VoerroTagsInput)
// const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

export default {
  props: ['spec', 'name', 'item'],
  components: {
    // VoerroTagsInput
  },
  data() {
    return {
       object: this.item || {},
  //   }
  // },
  // data() {
  //   return {
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      // uploadFieldName: 'photos'
    }
  },
  computed: {
    // isInitial() {
    //   return this.currentStatus === STATUS_INITIAL;
    // },
    // isSaving() {
    //   return this.currentStatus === STATUS_SAVING;
    // },
    // isSuccess() {
    //   return this.currentStatus === STATUS_SUCCESS;
    // },
    // isFailed() {
    //   return this.currentStatus === STATUS_FAILED;
    // }
  },
  methods: {
    reset() {
      // reset form to initial state
      // this.currentStatus = STATUS_INITIAL;
      this.uploadedFiles = [];
      this.uploadError = null;
    },
    save(formData) {
      // upload data to the server
      // this.currentStatus = STATUS_SAVING;

      // this.uploadedFiles = [].concat(x);


      // upload(formData)
      //   .then(x => {
      //     this.uploadedFiles = [].concat(x);
      //     // this.currentStatus = STATUS_SUCCESS;
      //   })
      //   .catch(err => {
      //     this.uploadError = err.response;
      //     // this.currentStatus = STATUS_FAILED;
      //   });
    },
    filesChange(fieldName, fileList) {
      let data = {
        state: 'uploading',
        name: fieldName,
        url: '#'
      }
      this.uploadedFiles.push(data)

      // setTimeout(() => {
      //   data.state = 'saved'
      // })
      // handle file changes
      // const formData = new FormData();
      //
      // if (!fileList.length) return;
      //
      // // append the files to FormData
      // Array
      //   .from(Array(fileList.length).keys())
      //   .map(x => {
      //     formData.append(fieldName, fileList[x], fileList[x].name);
      //   });
      //
      // // save it
      // this.save(formData);
    },
    removeFile (signedId) {
      console.log('removeFile', signedId)
    }
  },
  mounted () {
    this.reset();
  },
  // beforeMount() {
  //   // console.log('StandardInput', this.object, this.spec.default)
  //   // this.object[this.name] = this.object[this.name] || this.spec.default
  // },
  // created() {
  //   console.log('StandardInput', this, this.spec, this.name, this.item)
  // },
  // methods: {
  //   tagArrayToObject(tags) {
  //     return tags.reduce((acc, cur, i) => {
  //       acc[cur] = cur
  //       return acc
  //     }, {})
  //   }
  // }
}
</script>

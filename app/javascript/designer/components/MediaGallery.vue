<template>
  <div class="image-uploader">
    <!--
    <button type="button" class="btn btn-danger float-right btn-is-option" @click.prevent="showOptions = !showOptions">
      <i class="fa fa-cog" aria-hidden="true"></i>
      Options
    </button>
    <h1 id="example-title" class="example-title">Full Example</h1>
    -->

    <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
  		<h3>Drop files to upload</h3>
    </div>
    <div class="upload">
      <!-- v-show="!showOptions" -->
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <!-- <th>#</th> -->
              <th></th>
              <th>Name</th>
              <th>Size</th>
              <!-- <th>Speed</th> -->
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!files.length">
              <td colspan="7">
                <div class="text-center p-5">
                  <h4>Drop files anywhere to upload<br/>or</h4>
                  <label :for="name" class="btn btn-lg btn-success">Select Files</label>
                </div>
              </td>
            </tr>
            <tr v-for="(file, index) in files" :key="file.id">
              <!-- <td>{{index}}</td> -->
              <td>
                <img v-if="file.thumbnail || file.thumbnail_url" :src="file.thumbnail || file.thumbnail_url" width="50" height="auto" />
                <span v-else>No Image</span>
              </td>
              <td>
                <div class="filename">
                  {{file.name}}<br>
                  <em>{{file.kind}}</em>
                </div>
                <div class="progress" v-if="file.active || file.progress && file.progress !== '0.00'">
                  <div :class="{'progress-bar': true, 'progress-bar-striped': true, 'bg-danger': file.error, 'progress-bar-animated': file.active}" role="progressbar" :style="{width: file.progress + '%'}">{{file.progress}}%</div>
                </div>
              </td>
              <td>{{file.size | formatSize}}</td>

              <!--
              <td v-if="file.speed">{{file.speed | formatSize}}</td>
              <td v-else></td>
              -->

              <td v-if="file.error">{{file.error}}</td>
              <td v-else-if="file.persisted">persisted</td>
              <td v-else-if="file.success">success</td>
              <td v-else-if="file.active">active</td>
              <td v-else></td>
              <td align="right">
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-secondary btn-sm dropdown-toggle" data-toggle="dropdown" type="button"></button>
                  <div class="dropdown-menu" v-if="!file.persisted && !file.success">
                    <!-- <a :class="{'dropdown-item': true, disabled: file.active || file.success || file.error === 'compressing'}" href="#" @click.prevent="file.active || file.success || file.error === 'compressing' ? false :  onEditFileShow(file)">Edit</a> -->
                    <a :class="{'dropdown-item': true, disabled: !file.active}" href="#" @click.prevent="file.active ? $refs.upload.update(file, {error: 'cancel'}) : false">Cancel</a>

                    <a class="dropdown-item" href="#" v-if="file.active" @click.prevent="$refs.upload.update(file, {active: false})">Abort</a>
                    <a class="dropdown-item" href="#" v-else-if="file.error && file.error !== 'compressing' && $refs.upload.features.html5" @click.prevent="$refs.upload.update(file, {active: true, error: '', progress: '0.00'})">Retry upload</a>
                    <a :class="{'dropdown-item': true, disabled: file.success || file.error === 'compressing'}" href="#" v-else @click.prevent="file.success || file.error === 'compressing' ? false : $refs.upload.update(file, {active: true})">Upload</a>

                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#" @click.prevent="removeFile(index)">Remove</a>
                  </div>
                  <div class="dropdown-menu" v-else>
                    <a class="dropdown-item" href="#" @click.prevent="copyToClipboard(file.key)">Copy key</a>

                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#" @click.prevent="removeFile(index)">Remove</a>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="gallery-foorer mx-2">
        <div class="btn-group btn-group-sm">
          <file-upload
            class="btn btn-success dropdown-toggle"
            :post-action="postAction"
            :put-action="putAction"
            :extensions="extensions"
            :accept="accept"
            :multiple="multiple"
            :directory="directory"
            :size="size || 0"
            :thread="thread < 1 ? 1 : (thread > 5 ? 5 : thread)"
            :headers="headers"
            :data="data"
            :drop="drop"
            :drop-directory="dropDirectory"
            :add-index="addIndex"
            v-model="files"
            @input-filter="inputFilter"
            @input-file="inputFile"
            ref="upload">
            <!-- <i class="fa fa-plus"></i> -->
            Select
          </file-upload>
          <button type="button" class="btn btn-info" v-if="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">
            <i class="fa fa-arrow-up" aria-hidden="true"></i>
            Start Upload
          </button>
          <button type="button" class="btn btn-danger" v-else @click.prevent="$refs.upload.active = false">
            <i class="fa fa-stop" aria-hidden="true"></i>
            Stop Upload
          </button>
        </div>

        <!--
        <div class="footer-status">
          Drop: {{$refs.upload ? $refs.upload.drop : false}},
          Active: {{$refs.upload ? $refs.upload.active : false}},
          Uploaded: {{$refs.upload ? $refs.upload.uploaded : true}},
          Drop active: {{$refs.upload ? $refs.upload.dropActive : false}}
        </div>
        -->

      </div>
    </div>


    <!--
    <div class="option" v-show="showOptions">
      <div class="form-group">
        <label for="accept">Accept:</label>
        <input type="text" id="accept" class="form-control" v-model="accept">
        <small class="form-text text-muted">Allow upload mime type</small>
      </div>
      <div class="form-group">
        <label for="extensions">Extensions:</label>
        <input type="text" id="extensions" class="form-control" v-model="extensions">
        <small class="form-text text-muted">Allow upload file extension</small>
      </div>
      <div class="form-group">
        <label>PUT Upload:</label>
        <div class="form-check">
          <label class="form-check-label">
            <input class="form-check-input" type="radio" name="put-action" id="put-action" value="" v-model="putAction"> Off
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label">
            <input class="form-check-input" type="radio" name="put-action" id="put-action" value="/upload/put" v-model="putAction"> On
          </label>
        </div>
        <small class="form-text text-muted">After the shutdown, use the POST method to upload</small>
      </div>
      <div class="form-group">
        <label for="thread">Thread:</label>
        <input type="number" max="5" min="1" id="thread" class="form-control" v-model.number="thread">
        <small class="form-text text-muted">Also upload the number of files at the same time (number of threads)</small>
      </div>
      <div class="form-group">
        <label for="size">Max size:</label>
        <input type="number" min="0" id="size" class="form-control" v-model.number="size">
      </div>
      <div class="form-group">
        <label for="minSize">Min size:</label>
        <input type="number" min="0" id="minSize" class="form-control" v-model.number="minSize">
      </div>
      <div class="form-group">
        <label for="autoCompress">Automatically compress:</label>
        <input type="number" min="0" id="autoCompress" class="form-control" v-model.number="autoCompress">
        <small class="form-text text-muted" v-if="autoCompress > 0">More than {{autoCompress | formatSize}} files are automatically compressed</small>
        <small class="form-text text-muted" v-else>Set up automatic compression</small>
      </div>

      <div class="form-group">
        <div class="form-check">
          <label class="form-check-label">
            <input type="checkbox" id="add-index" class="form-check-input" v-model="addIndex"> Start position to add
          </label>
        </div>
        <small class="form-text text-muted">Add a file list to start the location to add</small>
      </div>

      <div class="form-group">
        <div class="form-check">
          <label class="form-check-label">
            <input type="checkbox" id="drop" class="form-check-input" v-model="drop"> Drop
          </label>
        </div>
        <small class="form-text text-muted">Drag and drop upload</small>
      </div>
      <div class="form-group">
        <div class="form-check">
          <label class="form-check-label">
            <input type="checkbox" id="drop-directory" class="form-check-input" v-model="dropDirectory"> Drop directory
          </label>
        </div>
        <small class="form-text text-muted">Not checked, filter the dragged folder</small>
      </div>
      <div class="form-group">
        <div class="form-check">
          <label class="form-check-label">
            <input type="checkbox" id="upload-auto" class="form-check-input" v-model="uploadAuto"> Auto start
          </label>
        </div>
        <small class="form-text text-muted">Automatically activate upload</small>
      </div>
      <div class="form-group">
        <button type="button" class="btn btn-success btn-lg btn-block" @click.prevent="showOptions = !showOptions">Confirm</button>
      </div>
    </div>

    <div :class="{'modal-backdrop': true, 'fade': true, show: addData.show}"></div>
    <div :class="{modal: true, fade: true, show: addData.show}" id="modal-add-data" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add data</h5>
            <button type="button" class="close"  @click.prevent="addData.show = false">
              <span>&times;</span>
            </button>
          </div>
          <form @submit.prevent="onAddData">
            <div class="modal-body">
              <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" class="form-control" required id="name"  placeholder="Please enter a file name" v-model="addData.name">
                <small class="form-text text-muted">Such as <code>filename.txt</code></small>
              </div>
              <div class="form-group">
                <label for="type">Type:</label>
                <input type="text" class="form-control" required id="type"  placeholder="Please enter the MIME type" v-model="addData.type">
                <small class="form-text text-muted">Such as <code>text/plain</code></small>
              </div>
              <div class="form-group">
                <label for="content">Content:</label>
                <textarea class="form-control" required id="content" rows="3" placeholder="Please enter the file contents" v-model="addData.content"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click.prevent="addData.show = false">Close</button>
              <button type="submit" class="btn btn-success">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>


    <div :class="{'modal-backdrop': true, 'fade': true, show: editFile.show}"></div>
    <div :class="{modal: true, fade: true, show: editFile.show}" id="modal-edit-file" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit file</h5>
            <button type="button" class="close"  @click.prevent="editFile.show = false">
              <span>&times;</span>
            </button>
          </div>
          <form @submit.prevent="onEditorFile">
            <div class="modal-body">
              <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" class="form-control" required id="name"  placeholder="Please enter a file name" v-model="editFile.name">
              </div>
              <div class="form-group" v-if="editFile.show && editFile.blob && editFile.type && editFile.type.substr(0, 6) === 'image/'">
                <label>Image: </label>
                <div class="edit-image">
                  <img :src="editFile.blob" ref="editImage" />
                </div>

                <div class="edit-image-tool">
                  <div class="btn-group" role="group">
                    <button type="button" class="btn btn-success" @click="editFile.cropper.rotate(-90)" title="cropper.rotate(-90)"><i class="fa fa-undo" aria-hidden="true"></i></button>
                    <button type="button" class="btn btn-success" @click="editFile.cropper.rotate(90)"  title="cropper.rotate(90)"><i class="fa fa-repeat" aria-hidden="true"></i></button>
                  </div>
                  <div class="btn-group" role="group">
                    <button type="button" class="btn btn-success" @click="editFile.cropper.crop()" title="cropper.crop()"><i class="fa fa-check" aria-hidden="true"></i></button>
                    <button type="button" class="btn btn-success" @click="editFile.cropper.clear()" title="cropper.clear()"><i class="fa fa-remove" aria-hidden="true"></i></button>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click.prevent="editFile.show = false">Close</button>
              <button type="submit" class="btn btn-success">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    -->
  </div>
</template>

<script>
// import Cropper from 'cropperjs'
// import ImageCompressor from '@xkeshi/image-compressor'
import FileUpload from 'vue-upload-component'
export default {
  name: 'MediaGallery',
  components: {
    FileUpload,
  },
  props: ['image_upload_path'],
  data() {
    return {
      files: [],
      accept: 'image/png,image/gif,image/jpeg,image/webp',
      extensions: 'gif,jpg,jpeg,png,webp',
      // extensions: ['gif', 'jpg', 'jpeg','png', 'webp'],
      // extensions: /\.(gif|jpe?g|png|webp)$/i,
      minSize: 1024,
      size: 1024 * 1024 * 10,
      multiple: true,
      directory: false,
      drop: true,
      dropDirectory: true,
      addIndex: false,
      thread: 3,
      name: 'file',
      postAction: this.image_upload_path, //'/upload/post',
      putAction: null, //this.image_upload_path, //'/upload/put',
      headers: {
        'X-Csrf-Token': 'xxxx',
      },
      data: {
        '_csrf_token': 'xxxxxx',
      },
      // autoCompress: 1024 * 1024,
      // uploadAuto: false,
      // showOptions: false,
      // addData: {
      //   show: false,
      //   name: '',
      //   type: '',
      //   content: '',
      // },
      // editFile: {
      //   show: false,
      //   name: '',
      // }
    }
  },
  created() {
    let self = this
    $.ajax({
      url: this.image_upload_path,
      dataType: 'json'
    }).done(function (result) {
      console.log('files', result)
      result.forEach(function(file) {
        file.persisted = true
        self.files.push(file)
      })
    })
  },
  // watch: {
  //   'editFile.show'(newValue, oldValue) {
  //     if (!newValue && oldValue) {
  //       this.$refs.upload.update(this.editFile.id, { error: this.editFile.error || '' })
  //     }
  //     if (newValue) {
  //       this.$nextTick(function () {
  //         if (!this.$refs.editImage) {
  //           return
  //         }
  //         let cropper = new Cropper(this.$refs.editImage, {
  //           autoCrop: false,
  //         })
  //         this.editFile = {
  //           ...this.editFile,
  //           cropper
  //         }
  //       })
  //     }
  //   },
  //   'addData.show'(show) {
  //     if (show) {
  //       this.addData.name = ''
  //       this.addData.type = ''
  //       this.addData.content = ''
  //     }
  //   },
  // },
  methods: {
    removeFile(index) {
      const file = this.files.splice(index, 1)[0]
      console.log('removing', file)

      if (file.delete_url) {
        $.ajax({
          type: 'DELETE',
          url: file.delete_url,
          // url: this.image_upload_path,
          data: {
            key: file.key
          }
        })
      }
      this.$refs.upload.remove(file)
    },
    inputFilter(newFile, oldFile, prevent) {
      console.log('input filter', newFile, oldFile)
      if (newFile && !oldFile) {
        // Before adding a file
        // Filter system files or hide files
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }
        // Filter php html js file
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent()
        }
        // Automatic compression
        // if (newFile.file && newFile.type.substr(0, 6) === 'image/' && this.autoCompress > 0 && this.autoCompress < newFile.size) {
        //   newFile.error = 'compressing'
        //   const imageCompressor = new ImageCompressor(null, {
        //     convertSize: Infinity,
        //     maxWidth: 512,
        //     maxHeight: 512,
        //   })
        //   imageCompressor.compress(newFile.file)
        //     .then((file) => {
        //       this.$refs.upload.update(newFile, { error: '', file, size: file.size, type: file.type })
        //     })
        //     .catch((err) => {
        //       this.$refs.upload.update(newFile, { error: err.message || 'compress' })
        //     })
        // }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // Create a blob field
        newFile.blob = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file)
        }
        // Thumbnails
        newFile.thumbnail = ''
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumbnail = newFile.blob
        }
      }
    },
    // add, update, remove File Event
    inputFile(newFile, oldFile) {
      console.log('input file', newFile, oldFile)
      if (newFile && oldFile) {
        // update
        if (newFile.active && !oldFile.active) {
          // beforeSend
          // min size
          if (newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize) {
            this.$refs.upload.update(newFile, { error: 'size' })
          }
        }
        if (newFile.progress !== oldFile.progress) {
          // progress
        }
        if (newFile.error && !oldFile.error) {
          // error
        }
        if (newFile.success && !oldFile.success) {
          // success
          newFile.persisted = true
          newFile.key = newFile.response[newFile.response.length - 1].key
        }
      }
      if (!newFile && oldFile) {
        // remove
        // if (oldFile.success && oldFile.response.id) {
        //   // $.ajax({
        //   //   type: 'DELETE',
        //   //   url: '/upload/delete?id=' + oldFile.response.id,
        //   // })
        // }
      }
      // Automatically activate upload
      if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
        if (this.uploadAuto && !this.$refs.upload.active) {
          this.$refs.upload.active = true
        }
      }
    },
    copyToClipboard(text) {
      const dummy = document.createElement('input')
      document.body.appendChild(dummy)
      dummy.value = text
      dummy.select()
      document.execCommand('copy', false)
      dummy.remove()
      toastr.info("Copied!")
      console.log('copied', text)
    },
    alert(message) {
      alert(message)
    },
    // onEditFileShow(file) {
    //   this.editFile = { ...file, show: true }
    //   this.$refs.upload.update(file, { error: 'edit' })
    // },
    // onEditorFile() {
    //   if (!this.$refs.upload.features.html5) {
    //     this.alert('Your browser does not support')
    //     this.editFile.show = false
    //     return
    //   }
    //   let data = {
    //     name: this.editFile.name,
    //   }
    //   if (this.editFile.cropper) {
    //     let binStr = atob(this.editFile.cropper.getCroppedCanvas().toDataURL(this.editFile.type).split(',')[1])
    //     let arr = new Uint8Array(binStr.length)
    //     for (let i = 0; i < binStr.length; i++) {
    //       arr[i] = binStr.charCodeAt(i)
    //     }
    //     data.file = new File([arr], data.name, { type: this.editFile.type })
    //     data.size = data.file.size
    //   }
    //   this.$refs.upload.update(this.editFile.id, data)
    //   this.editFile.error = ''
    //   this.editFile.show = false
    // },
    // onAddFolder() {
    //   if (!this.$refs.upload.features.directory) {
    //     this.alert('Your browser does not support')
    //     return
    //   }
    //   let input = this.$refs.upload.$el.querySelector('input')
    //   input.directory = true
    //   input.webkitdirectory = true
    //   this.directory = true
    //   input.onclick = null
    //   input.click()
    //   input.onclick = (e) => {
    //     this.directory = false
    //     input.directory = false
    //     input.webkitdirectory = false
    //   }
    // },
    // onAddData() {
    //   this.addData.show = false
    //   if (!this.$refs.upload.features.html5) {
    //     this.alert('Your browser does not support')
    //     return
    //   }
    //   let file = new window.File([this.addData.content], this.addData.name, {
    //     type: this.addData.type,
    //   })
    //   this.$refs.upload.add(file)
    // }
  }
}
</script>

<template lang="pug">
.preview-item(v-if='attachmentVisible(attachment)' :class="{'is-invalid': attachment.error}")
  .preview-overlay.flex-center
    .error.text-danger(v-if='attachment.error' v-b-tooltip :title='attachment.error')
      i.fas.fa-exclamation-triangle
    spinner(v-else-if='!attachment.key')
  a.delete(href='#' @click.prevent='$emit("remove", attachment)')
  img.img-fluid(v-if='attachment.thumbnail' :src='attachment.thumbnail')
  img.img-fluid(v-else-if='attachment.key || attachment.asset' :src='attachmentThumbnailUrl(attachment)' @error='setError')
  img.img-fluid(v-else-if='attachment.url' :src='attachment.url')
</template>

<script>
// import Input from '../../mixins/input'
import Attachments from '../../mixins/attachments'
import Spinner from '../../../base/components/Spinner'
// import { randomString, copyValue } from '../../../base/utils'


export default {
  // extends: Input,
  mixins: [ Attachments ],
  components: {
    Spinner
  },
  props: {
    attachment: {
      type: Object
    }
  },
  // data () {
  //   return {
  //     // object: this.model,
  //     attachment: null // this.model && typeof(this.model[this.name]) === 'object' ? this.model[this.name] : null
  //   }
  // },
  // created () {
  //   console.log('ATTACHMENT!!!!!!!!!!!!!!!!', this.currentValue)
  //   this.attachment = copyValue(this.currentValue)
  //
  //   // NOTE: It's necessary to initialize the object or `this.value` computed
  //   // getter doesnt update after setting value in upload callback. Just
  //   // initializing to NULL is not sufficient. This issue was noticed when
  //   // changing section layout on Artzine.
  //   // if (!this.value)
  //   //   this.value = {}
  // },
  // computed: {
  //   attachment () {
  //     return copyValue(this.currentValue)
  //   }
  // },
  methods: {
    setError () {
      if (this.attachment)
        this.attachment.error = 'Invalid image'
      this.$forceUpdate()
    },
    removeAttachment (attachment) {
      if (confirm("Are you sure?")) {
        if (attachment.key)
          this.destroyAttachment(attachment)
        // this.currentValue = null
      }
    }
  }
}
</script>

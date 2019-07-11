<template lang="pug">
dialog-window(
    title="Edit Social Links"
    :options='options'
    v-on='$listeners')
  slot
    social-links-form(
        ref='input'
        :object='$store.state.site'
        name='social_links'
        :showHeader='false')
    //- @update='emitUpdate'
  .dialog-footer(slot='footer')
    button.btn.w-50.dialog-btn.btn-cancel(@click.prevent='cancel') Cancel
    button.btn.w-50.dialog-btn.btn-apply(@click.prevent='save') Save
</template>

<script>
import DialogWindow from '../DialogWindow'
import SocialLinksForm from '../inputs-extended/SocialLinksInput'
// import { saveSite } from 'dashboard/api'
import { clone } from '../../../designer/utils'

export default {
  name: 'social-links-dialog',
  components: {
    DialogWindow,
    SocialLinksForm
  },
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
    }
  },
  methods: {
    cancel () {
      this.$refs.input.setInitialValue()
      this.$emit('close')
    },
    save () {
      // saveSite({
      //   social_links: this.$refs.input.value
      // }).then(_ => {
      //   // this.$store.state.site.social_links = this.socialLinksCloned
      //   this.$toast.success("Settings updated successfuly!")
      // })

      this.$emit('apply')
    }
  }
}
</script>

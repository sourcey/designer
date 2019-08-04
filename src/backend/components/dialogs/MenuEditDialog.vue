<template lang="pug">
dialog-window(
    title="Edit Navigation"
    :options='options'
    v-on='$listeners')
  slot
    menu-form(
        ref='input'
        :object='$store.state.site.menus'
        :name='menuName'
        :showHeader='false')
    //- @update='emitUpdate'
  .dialog-footer(slot='footer')
    button.btn.w-50.dialog-btn.btn-cancel(@click.prevent='cancel') Cancel
    button.btn.w-50.dialog-btn.btn-apply(@click.prevent='save') Save
</template>

<script>
import DialogWindow from '../DialogWindow'
import MenuForm from '../inputs-extended/MenuInput'
// import { saveSite } from 'dashboard/api'
import { clone } from '../../../base/utils'

export default {
  name: 'menu-edit-dialog',
  components: {
    DialogWindow,
    MenuForm
  },
  props: {
    options: {
      type: Object,
      default: () => {}
    },
    menuName: {
      type: String,
      required: true
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
      //   menus: this.$store.state.site.menus // this.$refs.input.value
      // }).then(_ => {
      //   // this.$store.state.site.social_links = this.socialLinksCloned
      //   this.$toast.success("Settings updated successfuly!")
      // })

      this.$emit('apply')
    }
  }
}
</script>

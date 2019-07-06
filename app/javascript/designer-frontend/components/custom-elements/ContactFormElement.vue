<template>
  <div class="element contact-form">
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group id="nameInputGroup"
                    label="Your Name"
                    label-for="nameInput">
        <b-form-input id="nameInput"
                      type="text"
                      v-model="form.name"
                      required
                      placeholder="Enter name...">
        </b-form-input>
      </b-form-group>
      <b-form-group id="emailInputGroup"
                    label="Email address"
                    label-for="emailInput">
                    <!-- description="We'll never share your email with anyone else." -->
        <b-form-input id="emailInput"
                      type="email"
                      v-model="form.email"
                      required
                      placeholder="Enter email...">
        </b-form-input>
      </b-form-group>
      <b-form-group v-if="showPhone" id="phoneInputGroup"
                    label="Phone number"
                    label-for="phoneInput">
        <b-form-input id="phoneInput"
                      type="tel"
                      v-model="form.phone"
                      placeholder="Enter phone number...">
        </b-form-input>
      </b-form-group>
      <b-form-group id="messageTextareaGroup"
                    label="Message"
                    label-for="messageTextarea">
        <b-form-textarea id="messageTextarea"
                         v-model="form.message"
                         placeholder="Your message..."
                         :rows="4">
        </b-form-textarea>
      </b-form-group>
      <div class="text-center mt-3">
        <b-button type="submit" variant="outline-default btn-action mx-auto" :disabled="disabled">Submit</b-button>
      </div>
      <!-- <b-button type="reset" variant="danger">Reset</b-button> -->
    </b-form>
  </div>
</template>

<script>
import axios from 'axios'
// import BlockContainer from '@/components/BlockContainer.vue'

export default {
  components: {
    // BlockContainer
  },
  props: {
    element: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        message: '',
      },
      disabled: false,
      show: true
    }
  },
  computed: {
    showPhone () {
      return this.data.show_phone
    }
  },
  methods: {
    onSubmit (evt) {
      let vm = this
      evt.preventDefault()
      this.disabled = true
      axios.post(this.$store.getters.siteApiUrl('/contact'), this.form)
        .then(response => {
          console.log('contact for: success', response)
          vm.$swal.fire('Success!', 'Your message has been sent.', 'success')
        })
        .catch(error => {
          console.log('contact for: error', error.response)
          let message = 'Your message could not be sent.'
          if (error.response.data &&
            error.response.data.message)
          message = error.response.data.message
          vm.$swal.fire('Oops...', message, 'error')
        })
        .then(() => {
          vm.disabled = false
        })
    },
    onReset (evt) {
      evt.preventDefault()
      /* Reset our form values */
      this.form.name = ''
      this.form.email = ''
      this.form.phone = ''
      this.form.message = ''
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.$nextTick(() => { this.show = true })
    }
  }
}
</script>

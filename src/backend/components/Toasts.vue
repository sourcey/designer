<template lang="pug">
#toasts
  .toast.show(
      ref='toast'
      v-for='(toast, index) in toasts'
      :key='index'
      :class='toast.variant'
      @click='dismiss(toast)') {{ toast.message }}
  //- b-alert.mb-025(v-for='(toast, index) in toasts' v-bind:key='index'
      :variant='toast.variant'
      :show='toast.timeout'
      dismissible
      fade
      @dismissed='toasts.splice(index, 1)') {{ toast.message }}
</template>

<script>
import { randomString } from '../../base/utils'

export default {
  name: 'toasts',
  data () {
    return {
      toasts: [],
    }
  },
  methods: {
    notify (args) {
      if (typeof(timeout) === 'undefined')
        args.timeout = 5
      args.id = randomString(5)
      this.toasts.push(args)
      if (args.timeout !== false) {
        setTimeout(() => this.dismiss(args), args.timeout * 1000)
      }
    },
    success (message, timeout) {
      this.notify({
        message: message,
        timeout: timeout,
        variant: 'success'
      })
    },
    info (message, timeout) {
      this.notify({
        message: message,
        timeout: timeout,
        variant: 'info'
      })
    },
    error (message, timeout) {
      this.notify({
        message: message,
        timeout: timeout,
        variant: 'error'
      })
    },

    dismiss (toast) {
      const index = this.toasts.findIndex(x => x.id === toast.id)
      if (index === -1) return
      this.$refs.toast[index].classList.remove('show')
      setTimeout(() => this.toasts.splice(index, 1), 500)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../assets/styles/_variables.scss';
@import '../assets/styles/_variables-bootstrap.scss';

#toasts {
  position: fixed;
  top: 10%;
  text-align: center;
  width: 100%;
  z-index: 2001;
}

.toast {
  margin: 0 auto .5rem;
  padding: 1rem;
  min-width: 275px;
  max-width: 500px;
  border-radius: 3rem;
  background-color: black;
  color: white;
  transition: opacity .3s ease-in-out;
  opacity: 0;

  &.success {
    background-color: darken(theme-color('success'), 10);
  }

  &.error {
    background-color: darken(theme-color('danger'), 10);
  }

  &.show {
    opacity: 1;
  }
}
</style>

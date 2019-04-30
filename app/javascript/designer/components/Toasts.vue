<template lang="pug">
#designer-toasts
  b-alert.mb-025(v-for='(toast, index) in toasts' v-bind:key='index'
      :variant='toast.variant'
      :show='toast.timeout'
      dismissible
      fade
      @dismissed='toasts.splice(index, 1)') {{ toast.message }}
</template>

<script>
export default {
  name: 'toasts',
  data() {
    return {
      toasts: [],
    }
  },
  methods: {
    notify(args) {
      if (typeof(timeout) === 'undefined')
        args.timeout = 5
      this.toasts.push(args)
    },
    success(message, timeout) {
      this.notify({
        message: message,
        timeout: timeout,
        variant: 'success'
      })
    },
    info(message, timeout) {
      this.notify({
        message: message,
        timeout: timeout,
        variant: 'info'
      })
    },
    error(message, timeout) {
      this.notify({
        message: message,
        timeout: timeout,
        variant: 'danger'
      })
    }
  }
}
</script>

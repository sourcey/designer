<template lang="pug">
#toasts
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

<style scoped lang="scss">
#toasts {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 0 .5rem .5rem 0;
  z-index: 2001;

  .alert {
    min-width: 275px;
  }
}
</style>

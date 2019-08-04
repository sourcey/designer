<template lang="pug">
.layout.layout-default.container
  slot
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

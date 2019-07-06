<template>
  <div class="layout layout-default container">
    <slot />
  </div>
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

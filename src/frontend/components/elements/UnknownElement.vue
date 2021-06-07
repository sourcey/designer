<template lang="pug">
.element
  div Unknown Element: {{ element }}
</template>

<script>
export default {
  props: {
    element: {
      type: Object,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
}
</script>

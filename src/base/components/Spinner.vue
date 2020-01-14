<template>
  <transition>
    <div class="text-center" :class="{ overlay: overlay }">
      <svg class="spinner" :class="{ show: show }" v-show="show" :width="`${size}px`" :height="`${size}px`" :viewBox="`0 0 ${size} ${size}`">
        <circle class="path" fill="none" stroke-width="4" stroke-linecap="round" :cx="size / 2" :cy="size / 2" :r="(size / 2) - 2"></circle>
      </svg>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'spinner',
  props: {
    show: {
      type: Boolean,
      default: true
    },
    overlay: {
      type: Boolean,
      default: false
    },
    size: {
      type: [Number, String],
      default: 44,
    }
  },
  serverCacheKey: props => `${props.show}::${props.overlay}::${props.size}`
}
</script>

<style scoped lang="scss">
$offset: 126;
$duration: 1.4s;

.overlay {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(white, .75);
}

.spinner {
  transition: opacity .15s ease;
  animation: rotator $duration linear infinite;
  animation-play-state: paused;
  &.show {
    animation-play-state: running;
  }
  &.v-enter, &.v-leave-active {
    opacity: 0;
  }
  &.v-enter-active, &.v-leave {
    opacity: 1;
  }
}

@keyframes rotator {
  0% {
    transform: scale(0.5) rotate(0deg);
  }
  100% {
    transform: scale(0.5) rotate(270deg);
  }
}

.spinner .path {
  stroke: #666; //#ff6600;
  stroke-dasharray: $offset;
  stroke-dashoffset: 0;
  transform-origin: center;
  animation: dash $duration ease-in-out infinite;
}

@keyframes dash {
  0% {
    stroke-dashoffset: $offset;
  }
  50% {
    stroke-dashoffset: ($offset/2);
    transform: rotate(135deg);
  }
  100% {
    stroke-dashoffset: $offset;
    transform: rotate(450deg);
  }
}
</style>

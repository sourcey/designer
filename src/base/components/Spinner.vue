<template>
  <!-- <transition> -->
    <div v-show="show" :class="{ overlay: overlay }" class="text-center">
      <svg class="spinner" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" :style='{ width: size + "px" }'>
        <circle class="path" cx="25" cy="25" r="23"/>
      </svg>
      <!-- <svg class="spinner" :class="{ show: show }" v-show="show" :width="`${size}px`" :height="`${size}px`" :viewBox="`0 0 ${size} ${size}`">
        <circle class="path" fill="none" stroke-width="4" stroke-linecap="round" :cx="size / 2" :cy="size / 2" :r="(size / 2) - 2"></circle>
      </svg> -->
    </div>
  <!-- </transition> -->
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
      default: 25,
    }
  },
  serverCacheKey: props => `${props.show}::${props.overlay}::${props.size}`
}
</script>

<style scoped lang="scss">
$offset: 190; //$offset; //126;
$duration: 2s;

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
  animation: rotator $duration linear infinite;
  max-width: 100px;

  // transition: opacity .15s ease;
  // animation-play-state: paused;
  // &.show {
  //   animation-play-state: running;
  // }
  // &.v-enter, &.v-leave-active {
  //   opacity: 0;
  // }
  // &.v-enter-active, &.v-leave {
  //   opacity: 1;
  // }
}

@keyframes rotator {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg)
  }
  // 0% {
  //   transform: scale(0.5) rotate(0deg);
  // }
  // 100% {
  //   transform: scale(0.5) rotate(270deg);
  // }
}

// https://glennmccomb.com/articles/building-a-pure-css-animated-svg-spinner/
.spinner .path {
  // stroke: #666; //#ff6600;
  // stroke-dasharray: $offset + 3; //0; //$offset + 3;
  // stroke-dashoffset: $offset; //0;
  // transform-origin: center;
  // // animation: dash $duration ease-in-out infinite;
  // animation: dash 1.4s ease-in-out infinite both;
  animation: dash 1.4s ease-in-out infinite both;
  display: block;
  fill: transparent;
  stroke: #666;
  stroke-linecap: round;
  stroke-dasharray: $offset + 3;
  stroke-dashoffset: $offset;
  stroke-width: 2px;
  transform-origin: center;
}

@keyframes dash {
  0%,
  25% {
    stroke-dashoffset: $offset;
    transform: rotate(0);
  }

  50%,
  75% {
    // stroke-dashoffset: 75;
    stroke-dashoffset: ($offset / 2);
    transform: rotate(45deg);
  }

  100% {
    stroke-dashoffset: $offset;
    transform: rotate(360deg);
  }
  // 0% {
  //   stroke-dashoffset: $offset;
  // }
  // 50% {
  //   stroke-dashoffset: ($offset/2);
  //   transform: rotate(135deg);
  // }
  // 100% {
  //   stroke-dashoffset: $offset;
  //   transform: rotate(450deg);
  // }
}
</style>

<template>
  <i class="icon" :class="`icon-${name}`">
    <svg :style="svgStyle">
      <use :xlink:href="'#' + name"></use>
    </svg>
  </i>
</template>

<script>
export default {
  props: {
    name: {
    },
    size: {
      default: '16',
    }
  },
  computed: {
    svgStyle () {
      return {
        width: this.size + 'px',
        height: this.size + 'px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.icon {
  // display: inline-block;
  // line-height: 1; // throws out alignment with inline text
  // vertical-align: middle; // necessary for buttons and navbar

  display: inline-flex;
  align-self: center;
  fill: currentColor;

  svg {
    display: inline-block;
    vertical-align: top;
    width: 100%;
    height: 100%;
  }

  // &.icon-16 {
  //   svg {
  //     width: 16px;
  //     height: 16px;
  //   }
  // }
  //
  // &.icon-24 {
  //   svg {
  //     width: 24px;
  //     height: 24px;
  //   }
  // }
  //
  // &.icon-32 {
  //   svg {
  //     width: 32px;
  //     height: 32px;
  //   }
  // }
}

// svg sprite
// body > svg,
// .icon use > svg,
// symbol {
//   path,
//   rect,
//   circle,
//   g {
//     fill: currentColor;
//     stroke: none;
//   }
//   *[d="M0 0h24v24H0z"] {
//     display: none;
//   }
// }
</style>

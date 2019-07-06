<template>
  <div class="image" :class="classNames" :style="backgroundCss">
    <div v-if="empty" class="placeholder">
      <Icon name="image-placeholder" size="64" />
    </div>
    <img v-if="!this.cover" :src="url" />
  </div>
</template>

<script>
import '../assets/images/image-placeholder.svg'

export default {
  props: {
    image: {
      type: [Object, String],
      default: null
    },
    size: {
      type: String,
      default: 'zoom'
    },
    cover: {
      type: String, // fill | contain
      default: null
    },
    // overlayOpacity: {
    //   type: Number,
    //   default: .3
    // },
    fillParent: {
      type: Boolean,
      default: false
    },
    aspectRatio: {
      type: Number,
      default: 1.5
    },
    autoSize: {
      type: Boolean,
      default: true
    },
    scaleWidth: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String, // pattern | solid
      default: null
    },
  },
  computed: {
    url () {
      return this.attachmentUrl(this.image, this.size)
    },
    empty () {
      return !this.url
    },
    classNames () {
      return {
        'cover': this.isCover,
        // 'cover': this.cover === 'cover',
        // 'contain': this.cover === 'contain',
        // 'overlay': this.overlay,
        'empty': this.empty,
        'fill-parent': this.fillParent,
        'scale-width': this.scaleWidth,
        'auto-size': this.autoSize
      }
    },
    isCover () {
      return this.cover && this.cover !== '' && this.cover !== 'none'
    },
    backgroundCss () {
      const css = {}
      if (this.isCover) {
        // const css = {
        //   'background-image': 'url("' + this.url + '")',
        //   'background-size': this.cover === 'contain' ? 'contain' : 'cover'
        // }
        css['background-image'] = 'url("' + this.url + '")'
        css['background-size'] = this.cover === 'contain' ? 'contain' : 'cover'
        if (this.aspectRatio && !this.fillParent && this.autoSize) {
          css['padding-bottom'] = (100 / this.aspectRatio) + '%'
        }
      }
      if (this.backgroundColor) {
        css['background-color'] = this.backgroundColor
      }
      return css
    },
    // overlayCss () {
    //   if (this.overlay === 'solid') { // && this.overlayOpacity
    //     return { 'background-color': `rgba(0,0,0,${this.overlayOpacity})` }
    //   }
    // },

    // The scale ratio only affects horizontal scaling when used in conjunction
    // with scaleWidth, and should not be confused with the aspectRatio prop
    // which is used to set the height of the element when used with background
    // cover styles and the height is unknown.
    scaleRatio () {
      if (this.image)
        return this.image.aspect_ratio
    }
  },
  mounted () {
    if (this.scaleRatio && this.scaleWidth) {
      // if (!this.fillParent) {
      //   console.log('The image `scaleWidth` options should be used in conjunction with `fillParent`.')
      // }

      // Set initial item dimensions
      this.updateScale()
      this.$nextTick(() => this.updateScale())
      window.addEventListener('resize', this.updateScale)
    }
  },
  beforeDestroy() {
    // window.addEventListener('resize', this.updateScale)
    if (this.scaleRatio && this.scaleWidth) {
      window.removeEventListener('resize', this.updateScale)
    }
  },
  methods: {
    updateScale () {
      // Scale the width based on the height. This is designed to be used in
      // conjunction with a 100% height layout.
      this.$el.cover.width = 'auto'
      this.$el.cover.width = `${this.$el.offsetHeight / this.scaleRatio}px`
      // console.log('scale image', this.$el.offsetHeight, this.scaleRatio)
      this.triggerLayout()
    },

    // Trigger the layout event to update carousels and masonry grids.
    triggerLayout () {
      this.$root.$emit('layout')
    }
  },
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/_mixins.scss';

.image {
  position: relative;
  text-align: center;
  background-position: center;
  background-repeat: no-repeat;

  // Use .img-fluid logic by default
  img {
    max-width: 100%;
    height: auto;
  }

  &.scale-width {
    height: 100%;

    // Required for image carousel content to scale to height
    img {
      height: 100%;
      width: auto;
      max-width: none;
    }
  }

  // Set a default height for non-expanding empty images
  // &:not(.cover).empty,
  // &:not(.contain).empty,
  // &:not(.fill-parent).empty {
  //   padding-bottom: 56.25%; // 75%;
  // }
  &.auto-size.empty {
    width: 100%;
    padding-bottom: 56.25%; // 75%;
  }

  // // Show the placeholder
  // .placeholder {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  //   background-color: $placebolder-background-color;
  //
  //   .icon {
  //     display: inline-block;
  //     position: absolute;
  //     top: 50%;
  //     left: 50%;
  //     margin-top: -32px;
  //     margin-left: -32px;
  //
  //     /deep/ svg {
  //       fill: darken($placebolder-background-color, 5);
  //     }
  //   }
  // }

  // Cover the element using the background image method
  // &.cover {
  //   // position: absolute;
  //   // top: 0;
  //   // left: 0;
  //   // right: 100%;
  //   // height: 100%;
  //
  //   // .cover-image {
  //   //   position: absolute;
  //   //   top: 0;
  //   //   left: 0;
  //   //   right: 0;
  //   //   bottom: 0;
  //     // background-size: cover;
  //   // }
  // }

  // Show the overlay pattern
  // .overlay {
  //   // z-index: -1;
  //   @include fill-parent;
  //
  //   &.solid {
  //     background-color: rgba(black, .3);
  //   }
  //
  //   &.pattern {
  //     background-image: url('../assets/images/overlay-pattern.png');
  //   }
  //
  //   // &:before {
  //   // content: '';
  //   // background-color: rgba(black, .3);
  //   // background-image: url('../assets/images/overlay-pattern.png');
  //   // position: absolute;
  //   // top: 0;
  //   // left: 0;
  //   // right: 0;
  //   // bottom: 0;
  //   // z-index: 1;
  //   // }
  // }
}
</style>

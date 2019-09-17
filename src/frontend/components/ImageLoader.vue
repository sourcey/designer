<template lang="pug">
//- .image(:class='classNames' :style='imageCss' v-on='$listeners')
  placeholder(v-if='empty')
  img(v-if='!this.fit' :src='url' v-on="$listeners")
.image(:class='classNames' :style='backgroundCss')
  placeholder(v-if='empty')
  img(v-else :src='url' :style='imageCss' v-on="$listeners")
</template>

<script>
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
    fit: {
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
      // default: 1.5
    },
    // autoSize: {
    //   type: Boolean,
    //   default: false
    // },
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
        'empty': this.empty,
        'fill-parent': this.fillParent,
        'scale-width': this.scaleWidth,
        'auto-size': this.aspectRatio
      }
    },
    isCover () {
      return this.fit && (this.fit === 'cover' || this.fit === 'contain')
    },
    backgroundCss () {
      const css = {}
      if (this.aspectRatio && this.isCover) {
        css['padding-bottom'] = (100 / this.aspectRatio) + '%'
        // css['background-color'] = this.backgroundColor
      }
      return css
    },
    imageCss () {
      const css = {}
      if (this.isCover) {
        // css['background-image'] = 'url("' + this.url + '")'
        // css['background-size'] = this.fit === 'contain' ? 'contain' : 'cover'
        // if (this.aspectRatio) { // && this.autoSize && !this.fillParent
        //   // css['height'] = 0
        //   css['padding-bottom'] = (100 / this.aspectRatio) + '%'
        // }
        css['object-fit'] = this.fit
        if (this.image && this.image.cover_position) {
          css['object-position'] = this.image.cover_position
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
      this.$el.style.width = 'auto'
      this.$el.style.width = `${this.$el.offsetHeight / this.scaleRatio}px`
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
  overflow: hidden;
  // text-align: center;
  // background-position: center;
  // background-repeat: no-repeat;

  // &.cover {
  //   position: absolute;
  // }

  // Fill but don't overflow the parent element
  img {
    background-position: center;
    background-repeat: no-repeat;
    // max-width: 100%;
    // height: auto;
  }

  &:not(.cover),
  &:not(.fill-parent) {
    img {
      max-width: 100%;
      height: auto;
    }
  }

  // &.scale-width {
  //   height: 100%;
  //
  //   // Required for image carousel content to scale to height
  //   img {
  //     height: 100%;
  //     width: auto;
  //     max-width: none;
  //   }
  // }

  // Set a default height for non-expanding empty images.
  // This will be overridden depending on the `aspectRatio`
  &.auto-size {
    &.empty {
      width: 100%;
      padding-bottom: 56.25%; // 75%;
    }

    // img {
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   height: 100%;
    //   width: 100%;
    // }
  }

  &.cover {
    img {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
  }

  &.parallax {
    clip: rect(0, auto, auto, 0);

    img {
      position: fixed;
    }
  }

  &.round {
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>

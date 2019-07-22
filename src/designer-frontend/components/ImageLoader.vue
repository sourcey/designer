<template lang="pug">
.image(:class='classNames' :style='backgroundCss' v-on='$listeners')
  placeholder(v-if='empty')
  img(v-if='!this.fit' :src='url')
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
        'empty': this.empty,
        'fill-parent': this.fillParent,
        'scale-width': this.scaleWidth,
        'auto-size': this.autoSize
      }
    },
    isCover () {
      return this.fit && this.fit !== '' && this.fit !== 'none'
    },
    backgroundCss () {
      const css = {}
      if (this.isCover) {
        css['background-image'] = 'url("' + this.url + '")'
        css['background-size'] = this.fit === 'contain' ? 'contain' : 'cover'
        if (this.aspectRatio && this.autoSize && !this.fillParent) {
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
      this.$el.fit.width = 'auto'
      this.$el.fit.width = `${this.$el.offsetHeight / this.scaleRatio}px`
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

  // Fill but don't overflow the parent element
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

  // Set a default height for non-expanding empty images.
  // This will be overridden depending on the `aspectRatio`
  &.auto-size.empty {
    width: 100%;
    padding-bottom: 56.25%; // 75%;
  }

  &.round {
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>

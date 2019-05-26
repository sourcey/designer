<template lang="pug">
.dialog-window(
    :id='id'
    :style='dialogStyle'
    :class='{"dragging": dragging}')
  .dialog-overlay(ref='overlay' @click='onOverlayClick')
    //:class="{ 'show': show, 'loading': loading }"
  .dialog-header(v-if='title' @mousedown='mouseDown')
    .title {{title}}
  .dialog-body.flex-fill(:class='bodyClass')
    slot
      .blank-body
  slot(name='footer')
</template>

<script>
export default {
  props: ['id', 'title', 'options'],
  data () {
    return {
      width: 0,
      height: 0,
      offset: {
        x: 0,
        y: 0
      },
      left: 0,
      top: 0,
      draggable: true,
      // drag: true,
      centered: false,
      dragging: false,
      bodyClass: '',
      // pX: 0,
      // pY: 0,
      availableOptions: [
        'left',
        'top',
        'width',
        'height',
        'centered',
        'bodyClass'
      ]
    }
  },
  created () {
    this.setOptions(this.options)
  },
  mounted () {
    if (this.draggable) {
      document.addEventListener('mousemove', this.mouseMove, { passive: true })
      document.addEventListener('mouseup', this.mouseUp)
      window.addEventListener('resize', this.autoPosition.bind(this))
    }

    if (this.centered) {
      this.$nextTick(() => {
        this.center()
        // this.autoPosition()
        this.emit('ready')
      })
    } else {
      this.$nextTick(() => {
        this.autoPosition()
        this.emit('ready')
      })
    }
  },
  beforeDestroy () {
    if (this.draggable) {
      document.removeEventListener('mousemove', this.mouseMove)
      document.removeEventListener('mouseup', this.mouseUp)
      window.removeEventListener('resize', this.autoPosition.bind(this))
    }
  },
  // watch: {
  //   options (newValue) {
  //     this.setOptions(newValue)
  //     if (newValue.centered) this.center()
  //   }
  // },
  computed: {
    dialogStyle () {
      let style = { left: this.left + 'px', top: this.top + 'px' }
      if (this.width) style.width = this.width + 'px'
      if (this.height) style.height = this.height + 'px'
      return style
    }
  },
  methods: {
    onOverlayClick(event) {

      // Close when overlay is clicked
      if (event.target === this.$refs.overlay)
        this.close()
    },
    mouseOut (event) {
      if (!this.draggable && this.dragging) {
        this.move(event)
      }
    },
    mouseDown (event) {
      // console.log('mouseDown')
      if (!this.dragging) this.focus()
      // if (!this.dropEnabled) {
        // if (this.drag)
        event.preventDefault()
        this.startMove(event)
      // }
    },
    mouseMove (event) {
      // event.preventDefault()
      if (this.dragging) { // && this.drag
        // event.stopPropagation()
        // setTimeout(this.move(event), 50)
        this.move(event)
      }
    },
    mouseUp (event) {
      event.preventDefault()
      this.stopMove()
    },
    move (event) {
      if (this.draggable) { //this.drag &&
        // if (event.clientX === 0) event = this.overEvent // for firefox
        // if (event && event.clientX && event.clientY) {
          const x = event.clientX
          const y = event.clientY
          this.left = (x + this.offset.x)
          this.top = (y + this.offset.y)
          this.dragging++
          // console.log('move', this.left)
          //this.emit('move')
        // }
      }
    },
    startMove (event) {
      const x = this.left - event.clientX
      const y = this.top - event.clientY
      this.offset = { x, y }
      this.dragging = 1
      this.emit('dragStart')
    },
    stopMove () {
      this.dragging = false
      // this.pX = 0
      // this.pY = 0
      this.emit('dragStop')
    },
    focus (event) {
      // if (this.drag)
      this.clearSelection()
      // let vm = this
      setTimeout(() => {
        this.emit('focus')
      }, 200)
    },
    center () {
      let ww, wh
      if (this.centered === 'window') {
        ww = window.innerWidth
        wh = window.innerHeight
      }
      if (this.centered === 'viewport') {
        const body = document.body
        ww = body.clientWidth + body.scrollLeft
        wh = body.clientHeight + body.scrollTop
      }
      ww = ww || this.$parent.$el.clientWidth
      wh = wh || this.$parent.$el.clientHeight
      this.left = (ww / 2) - (this.$el.clientWidth / 2)
      this.top = (wh / 2) - (this.$el.clientHeight / 2)
    },
    close () {
      this.emit('close')
    },
    clearSelection () {
      if (document.selection) {
        document.selection.empty()
      } else if (window.getSelection) {
        window.getSelection().removeAllRanges()
      }
    },
    emit (eventName, data) {
      data = data || {
        id: this.id,
        left: this.left,
        top: this.top,
        x: this.left,
        y: this.top,
        width: this.$el.clientWidth,
        height: this.$el.clientHeight
      }
      this.$emit(eventName, data)
    },
    autoPosition () {

      // Fix left position
      if (this.left && this.$el.clientWidth) {
        const viewWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
        const leftOffset = (this.left + this.$el.clientWidth) - viewWidth //  + document.body.scrollLeft
        if (leftOffset > 0)
          this.left -= leftOffset + 20
      }

      // Fix bottom position
      if (this.$el.clientHeight) { // this.top && && this.options.height
        const rect = this.$el.getBoundingClientRect()
        const viewHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        // const topOffset = (this.top + this.$el.clientHeight) - (viewHeight) //  + document.body.scrollTop
        const topOffset = (rect.top + this.$el.clientHeight) - (viewHeight) //  + document.body.scrollTop
        console.log('dialog window: auto bottom position', rect, viewHeight, topOffset)
        if (topOffset > 0) {
          if (!this.top) this.top = 0
          this.top -= topOffset + 20
        }
      }
    },
    setOptions (options) {
      if (options) {
        if (options.x) options.left = options.x
        if (options.y) options.top = options.y
        // console.log('setOptions', options.left)
        // if (options.left || options.top)
        //   this.offset = { x: options.left, y: options.top }

        let opts = this.availableOptions
        for (let opt of opts) {
          if (this.options.hasOwnProperty(opt)) {
            this.$set(this, opt, this.options[opt])
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
// @import 'designer/app/assets/stylesheets/designer/_variables';
// @import 'stylesheets/_dashboard-theme';

</style>

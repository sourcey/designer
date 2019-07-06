<template lang="pug">
  span(:class='{"dragging": dragging}' @mousedown='mouseDown')
  //- draggable="true"
  //- @dragstart="dragStart"
  //- @drag="dragMove"
  //- @dragend="dragEnd"
</template>

<script>
import DesignerInterface from '../mixins/designer-interface.js'

export default {
  props: {
    position: {
      type: String,
      default: null
    }
  },
  mixins: [
    DesignerInterface
  ],
  data () {
    return {
      dragging: false,
      x: false,
      y: false,
      rect: null
    }
  },
  computed: {
    data () {
      return { x: this.x, y: this.y, rect: this.rect }
    }
  },
  methods: {
    // dragStart (event) {
    //   this.dragging = true
    //   this.x = this.y = 0
    //   this.$emit('start', event)
    //   console.log('resize handle: dragStart')
    // },
    // dragEnd (event) {
    //   this.dragging = false
    //   this.x = this.y = false
    //   console.log('resize handle: dragEnd')
    //   this.$emit('end', this.data)
    // },
    // dragMove (event) {
    //   if (this.dragging) {
    //     this.x = event.clientX
    //     this.y = event.clientY
    //
    //     // NOTE: Chrome triggering drag event with 0x0 before dragend so make
    //     // sure thats not emitted to the client.
    //     if (this.x && this.y)
    //       this.$emit('drag', this.data)
    //   }
    // },
    mouseDown (event) {
      console.log('resize handle: start')
      this.dragging = true
      this.x = this.y = 0
      this.$emit('start', event)
      // if (!this.dragging) this.focus()
      // if (!this.dropEnabled) {
        // if (this.drag)
        event.preventDefault()
        // this.startMove(event)
      // }
    },
    mouseMove (event) {
      if (this.dragging) {
        this.x = event.clientX
        this.y = event.clientY
        console.log('resize handle: drag', event, this.x, this.y)

        // NOTE: Chrome triggering drag event with 0x0 before dragend so make
        // sure thats not emitted to the client.
        if (this.x && this.y)
          this.$emit('drag', this.data)
          // event.preventDefault()
      }
      // if (this.dragging) { // && this.drag
      //   // event.stopPropagation()
      //   // setTimeout(this.move(event), 50)
      //   this.move(event)
      // }
    },
    mouseUp (event) {
      event.preventDefault()
      // this.stopMove()
      this.dragging = false
      this.x = this.y = false
      console.log('resize handle: end')
      this.$emit('end', this.data)
    },
    updateRect () {
      this.rect = this.$el.getBoundingClientRect()
    }
  },
  mounted () {
    this.updateRect()
    window.addEventListener('resize', this.updateRect)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.updateRect)
  },
  watch: {
  	dragging: function(newVal, oldVal) {
      if (newVal) {
        document.addEventListener('mousemove', this.mouseMove) //, { passive: true }
        document.addEventListener('mouseup', this.mouseUp)
      } else {
        document.removeEventListener('mousemove', this.mouseMove)
        document.removeEventListener('mouseup', this.mouseUp)
      }
    }
  }
}
</script>

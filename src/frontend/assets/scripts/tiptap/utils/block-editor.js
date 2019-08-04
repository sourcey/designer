// import { setTextSelection } from 'prosemirror-utils';

export default {
  props: ['node', 'view', 'updateAttrs', 'editable', 'getPos'],
  computed: {
    designerBackend () {
      return this.$store.getters.designerBackend
    },
    contentEmpty () {
      return this.node.content.size === 0
    },
    isRegular () {
      return !this.node.attrs.class || this.node.attrs.class.length === 0
    },
    isLeft () {
      return this.node.attrs.class && this.node.attrs.class.indexOf('left') !== -1
    },
    isRight () {
      return this.node.attrs.class && this.node.attrs.class.indexOf('right') !== -1
    },
    isPull () {
      return this.node.attrs.class && this.node.attrs.class.indexOf('pull') !== -1
    }
  },
  methods: {
    updateClass (addClass, removeClasses) {
      const classes = new Set(this.node.attrs.class ? String(this.node.attrs.class).split(' ') : [])
      if (addClass) {
        if (classes.has(addClass))
          classes.delete(addClass)
        else
          classes.add(addClass)
      }
      if (removeClasses) {
        removeClasses.forEach(x => classes.delete(x))
      }

      this.updateAttrs({
        class: Array.from(classes).join(' ')
      })
    },
    selectNode (event) {
      // this.selected = true
      // const coordinates = this.view.posAtCoords({
      //   left: event.clientX,
      //   top: event.clientY
      // })
      // if (coordinates) {
      //   this.view.dispatch(
      //     setTextSelection(coordinates.pos)(this.view.state.tr)
      //   )
      // }
    },
    deleteNode() {
      if (confirm("Are you sure?")) {
        let tr = this.view.state.tr
        let pos = this.getPos()
        tr.delete(pos, pos + this.node.nodeSize)
        this.view.dispatch(tr)
      }
    },
  }
}

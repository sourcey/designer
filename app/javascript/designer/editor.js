import SimpleMDE from 'simplemde/dist/simplemde.min'

export default class Editor {
  constructor(element) {
    let self = this

    this.mde = new SimpleMDE({
      element: element,
      forceSync: true,
      autoDownloadFontAwesome: false,
      toolbar: ['bold', 'italic', 'strikethrough', 'heading', '|',
            'unordered-list', 'ordered-list', 'quote', 'code', 'table', 'link', '|',
            'clean-block', 'fullscreen']
    })

    // console.log(this.mde.gui.toolbar)
    $(this.mde.gui.toolbar).find('.fa-header').attr('class', 'fa fa-heading')

    this.mde.codemirror.on('drop', function(cm, event) {
      const id = event.dataTransfer.getData('id')
      const embed = event.dataTransfer.getData('embed')
      console.log('handleDrop', cm, event, id, embed)

      var coords = cm.coordsChar({ left: event.x, top: event.y })
      cm.replaceRange(embed, coords)
      event.preventDefault()
    })
  }
  destroy() {
    this.mde.toTextArea()
  }
  refresh() {
    var self = this
    setTimeout(function() { self.mde.codemirror.refresh() }, 0)
  }
  value() {
    return this.mde.value()
  }
  toggleFullscreen() {
    const elem = this.mde.options.element || document.documentElement;
    if (!document.fullscreenElement && !document.mozFullScreenElement &&
      !document.webkitFullscreenElement && !document.msFullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    }
    else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }
}

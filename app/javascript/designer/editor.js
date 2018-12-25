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

    this.mde.codemirror.on('drop', function(cm, event) {
      const id = event.dataTransfer.getData('id')
      // const element = document.getElementById(id)
      const code = event.dataTransfer.getData('code')
      console.log('handleDrop', cm, event, id, code)

      var coords = cm.coordsChar({ left: event.x, top: event.y })
      cm.replaceRange(code, coords)
      event.preventDefault()
    })
  }
  refresh() {
    var self = this
    setTimeout(function() { self.mde.codemirror.refresh() }, 0)
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

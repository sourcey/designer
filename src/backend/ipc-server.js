import Vue from 'vue'
// import Hooks from './hooks'


export default {
  selectElementProperty (element, spec, name) {

    // Select the current element on the preview
    if (element.id && name) {
      this.postPreviewMessage('selectProperty', {
        elementId: element.id,
        name: name
      })
    }
  },

  updateResourceProperty (item, name, value, spec) {
    console.log('updateResourceProperty', item, name, value, spec)

    this.postPreviewMessage('updateResourceProperty', {
      name: name,
      value: value,
      member: spec ? spec.member : null
    })

    if (spec && (spec.type == 'font' || spec.type == 'color')) {
      this.postPreviewMessage('updateStyle', {
        name: name,
        value: value
      })
    }
  },

  updateElementProperty (item, spec, name, value) {

    // Perform and required update actions
    // Hooks.executeUpdate (spec, object.data, name, value)
    console.log('updateElementProperty', item, spec, spec.properties[name].type, name, value)

    // Update the property in the preview
    // switch(spec.properties[name].type) {
    //   case 'color':
    //   case 'font':
    //     break;
    //   default:
        // if (object.elements || object.layouts) { // handle page properties
        //   this.postPreviewMessage('updatePageProperty', {
        //     pageId: object.id,
        //     name: name,
        //     value: value
        //   })
        // } else {
          this.postPreviewMessage('updateElementProperty', {
            elementId: object.id,
            name: name,
            value: value
          })

        // }
    // }
  },

  postPreviewMessage (action, data) {
    window.frames.preview.postMessage({
      action: action,
      data: data
    }, '*')
  }
}

import Vue from 'vue'
import Hooks from './hooks'


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

  updateResourceProperty (item, spec, name, value) {
    const type = spec.properties[name].type
    console.log('updateResourceProperty', item, spec, type, name, value)
    if (type == 'font' || type == 'color') {
      this.postPreviewMessage('updateStyle', {
        name: name,
        value: value
      })
    } else {
      this.postPreviewMessage('updateResourceProperty', {
        name: name,
        value: value
      })
    }
  },

  updateElementProperty (item, spec, name, value) {

    // Perform and required update actions
    Hooks.executeUpdate (spec, item.data, name, value)
    console.log('updateElementProperty', item, spec, spec.properties[name].type, name, value)

    // Update the property in the preview
    // switch(spec.properties[name].type) {
    //   case 'color':
    //   case 'font':
    //     break;
    //   default:
        // if (item.elements || item.layouts) { // handle page properties
        //   this.postPreviewMessage('updatePageProperty', {
        //     pageId: item.id,
        //     name: name,
        //     value: value
        //   })
        // } else {
          this.postPreviewMessage('updateElementProperty', {
            elementId: item.id,
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

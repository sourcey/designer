import GoogleFontLoader from './google-font-loader'

const utils = {
	scrollTo (element) {
		console.log('scrollTo', element)
		if (this.isInViewport(element))
			return

    var offset = 0, y = 0, dy, call = setInterval(function(){
    	if (Math.abs(dy=offset-y)>1) y += dy/8;
      else { clearInterval(call); y = offset; }
      document.documentElement.scrollTop = y;
    }, 10);
    offset = element.offsetTop;
		y = document.documentElement.scrollTop;
	},

	isInViewport (element) {
    var rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
	},

	pulseClass (element, className, duration) {
		duration = duration || 1000
		element.classList.add(className)
		setTimeout(() => {
			element.classList.remove(className)
		}, duration)
	},

	addClass (element, className) {
		element.classList.add(className)
	},

	removeClass (element, className) {
		element.classList.remove(className)
	}
}

const appActions = {
	createPage (vm, command) {
		// if (command.path)
		vm.$store.commit('addPage', command)
		if (command.data.path)
			vm.$router.push(command.data.path)
	},

	removePage (vm, command) {
		// if (command.path)
		console.log('designer ipc: removePage', vm.$store.state.pageId, command.id)
		if (vm.$store.state.pageId == command.id)
			vm.$router.push('/')
		vm.$store.commit('removePage', command.id)
		// vm.$store.commit('addPage', command)
		// if (command.data.path)
		// 	vm.$router.push(command.data.path)
	},

	selectPage (vm, command) {
		console.log('designer ipc: selectPage', vm.$store.state.pageId, command)
		if (command.path)
			vm.$router.push(vm.sitePath(command.path))
	},

	// createElement(vm, command) {
	// 	vm.$store.commit('addElement', {
	// 		pageId: command.id,
	// 		block: command.block
	// 	})
	// },
	//
	// removeElement(vm, command) {
	// 	vm.$store.commit('removeElement', {
	// 		pageId: command.id,
	// 		blockId: command.blockId
	// 	})
	// },
	//
	// reorderElement(vm, command) {
	// 	vm.$store.commit('reorderElement', {
	// 		pageId: vm.$root.designerPage.id,
	// 		blockId: command.id,
	// 		oldIndex: command.oldIndex,
	// 		newIndex: command.newIndex
	// 	})
	// },
	//
	// selectElement (vm, command) {
	// 	const element = document.getElementById(command.blockId)
	// 	utils.scrollTo(element) // FIXME
	// 	utils.pulseClass(element, 'block-selected')
	// },
	//
	// selectProperty (vm, command, elementData) {
	// 	const element = document.getElementById(command.blockId)
	// 	const property = element.querySelector(`[data-bind="${command.name}"]`)
	// 	if (property && property.classList) {
	// 		utils.scrollTo(property)
	// 		utils.pulseClass(property, 'property-selected')
	// 	}
	// },



	removeSection (vm, command) {
		console.log('designer ipc: removeSection', command)
		vm.$store.commit('removeDesignerSection', command.sectionId)
	},

	updateResourceProperty(vm, command) {
		const object = vm.$store.getters.designerPage
		console.log('designer ipc: updateResourceProperty', command, object)
		if (command.member)
			vm.$set(object[command.member], command.name, command.value)
		else
			vm.$set(object, command.name, command.value)

		// console.log('designer ipc: updateResourceProperty', object[command.member])
		// NOTE: since we are mutating elementData the block.data must contain a
		// default value for this property or it wont be updated
    // vm.$store.commit('setElementProperty', {
    //   data: vm.designerPage(command.pageId),
    //   name: command.name,
    //   value: command.value
    // })
	},

	updatePageProperty(vm, command) {
		console.log('designer ipc: updatePageProperty', command)

		let data = vm.$store.getters.designerPage.data
		vm.$set(data, command.name, command.value)
	},

	updateSectionProperty(vm, command) {
		console.log('designer ipc: updateSectionProperty', command)

		let data = vm.$store.getters.designerEditingSection.data
		vm.$set(data, command.name, command.value)
	},

	updateElementProperty(vm, command) {
		console.log('designer ipc: updateElementProperty', command)

		let data = vm.$store.getters.designerEditingElement.data
		console.log('designer ipc: updateElementProperty data', vm.$store.getters.designerEditingElement.element)
		vm.$set(data, command.name, command.value)
		// vm.$store.getters.designerEditingElement.$forceUpdate()
		// vm.$set(vm.findElementData(command.blockId), command.name, command.value)

		// NOTE: since we are mutating elementData the block.data must contain a
		// default value for this property or it wont be updated
    // vm.$store.commit('setProperty', {
    //   data: vm.findElementData(command.blockId),
    //   name: command.name,
    //   value: command.value
    // })
	},

	cssPropertyName (name, suffix) {
		if (suffix)
			return `--${name.replace(/_/g, '-')}-${suffix}`
		else
			return `--${name.replace(/_/g, '-')}`
	},

  // cssVar (name, value) {
  //   return `--${name}: ${value};`
  // },
	//
  // cssFontValues (name, font) {
  //   let values = {}
  //   if (font.weight) {
  //     // value += `\n  `
  //     values.weight += `--${name}-weight: '${parseInt(font.weight)}';`
  //   }
  //   return values
  // },

	cssPropertyValue (value) {
		// if (value.family) {
		// 	// if (value.category) {
		// 	// 	return `'${value.family}', ${value.category}`
		// 	// } else {
		// 	// 	return value.family
		// 	// }
		// } else {
	  //   return value
		// }
    return value
	},

	clearStyle (vm, command) {
		document.documentElement.removeAttribute('style')
	},

	updateStyle (vm, command) {
		console.log('designer ipc: update style', command)

		// if (value.family) {
		//
		// }	else {
		//
		// }

		// Import fonts if required
		if (command.value.family) {
			const font = command.value
			const url = GoogleFontLoader.importUrl(font)
			console.log('designer ipc: load font: ', url)
			const element = document.createElement('link')
			element.setAttribute('rel', 'stylesheet')
			element.setAttribute('type', 'text/css')
			element.setAttribute('href', url)
			document.getElementsByTagName('head')[0].appendChild(element)

	    if (font.category)
				document.documentElement.style.setProperty(
					this.cssPropertyName(command.name, 'family'), `'${font.family}', ${font.category}`)
	    else
				document.documentElement.style.setProperty(
					this.cssPropertyName(command.name, 'family'), font.family)
	    if (font.weight)
				document.documentElement.style.setProperty(
					this.cssPropertyName(command.name, 'weight'), font.weight)
	    if (font.style)
				document.documentElement.style.setProperty(
					this.cssPropertyName(command.name, 'style'), font.style)
		}
		else {
			document.documentElement.style.setProperty(
				this.cssPropertyName(command.name),
				this.cssPropertyValue(command.value))
		}

    // vm.$store.commit('setStyle', {
    //   name: command.name,
    //   value: command.value
    // })
	}
}


let handlers = {}

export default {
	registerApp (vm) {
		handlers[vm] = (event) => {
			console.log('designer ipc app', event.data)
			if (appActions[event.data.action]) {
				appActions[event.data.action](vm, event.data.data)
			}
		}
		window.addEventListener('message', handlers[vm])
		// vm.$el.classNames.add('designer-active')
		utils.addClass(document.body, 'designer-active')
	},
	unregister (vm) {
		window.removeEventListener('message', handlers[vm])
		// vm.$el.classNames.remove('designer-active')
		utils.removeClass(document.body, 'designer-active')
	}
}

// registerElement (vm, id, elementData) {
// 	handlers[vm] = (event) => {
// 		if (event.data.data &&
// 			event.data.data.id == id &&
// 			blockActions[event.data.action]) {
// 			// console.log('designer ipc block', event.data)
// 			blockActions[event.data.action](vm, event.data.data, elementData)
// 		}
// 	}
// 	window.addEventListener('message', handlers[vm])
// },
//
// let handlers = {}
//
// export default {
// 	registerApp (vm) {
// 		handlers[vm] = (event) => {
// 			console.log('designer ipc app', event.data)
// 			if (appActions[event.data.action]) {
// 				appActions[event.data.action](vm, event.data.data)
// 			}
// 		}
// 		window.addEventListener('message', handlers[vm])
// 	},
// 	registerElement (vm, id, elementData) {
// 		handlers[vm] = (event) => {
// 			if (event.data.data &&
// 				event.data.data.id == id &&
// 				blockActions[event.data.action]) {
// 				// console.log('designer ipc block', event.data)
// 				blockActions[event.data.action](vm, event.data.data, elementData)
// 			}
// 		}
// 		window.addEventListener('message', handlers[vm])
// 	},
// 	unregister (vm) {
// 		window.removeEventListener('message', handlers[vm])
// 	}
// }

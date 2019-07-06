export default {
  cssImport (font) {
    return `@import url('${this.importUrl(font)}');`
  },

  importUrl (font) {
    return `https://fonts.googleapis.com/css?family=${font.family}:${this.importUrlWeights(font)}`
  },

  importUrlWeights (font) {
    if (font.weights) {
      return font.weights.join(',')
    } else {
      return '400,400i,700,700i'
    }
  }
}

// Helper class to normalize grid column span widths
export default {
  balance (distribution, goal, precision) {

    // Reduce the distribution to the sum of its values
    const sum = this.sum(distribution)

    // For each value in the distribution, get its percentage.
    const percentages = distribution.map(value => value / sum)

    // For each percentage, multiply the goal to get an equally distributed value.
    const goalDistribution = percentages.map(percentage => goal * percentage)

    // For each value, round them off.
    const result = goalDistribution.map(value => this.round(value, precision))

    // Fix possibly incorrect results with 0 precision where multiple values are
    // rounded from .5. If so shave the remainder off the largest value.
    if (precision === 0) {
      const remainder = this.sum(result) - goal
      if (remainder) {
        const index = result.indexOf(Math.max.apply(this,result))
        result[index] -= remainder
      }
    }

    return result
  },
  round (number, precision) {
    const factor = Math.pow(10, precision)
    return Math.round(number * factor) / factor
  },
  sum (values) {
    return values.reduce((sum, value) => sum + value, 0)
  }
}

/* eslint no-extend-native: 0 */

String.prototype.multiply = function (n) {
  let output = ''

  for (let i = 0; i < n; i++) {
    output += this
  }

  return output
}

console.log('HolaMundo'.multiply(5))

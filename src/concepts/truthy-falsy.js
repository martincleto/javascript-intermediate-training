
function sonIguales (a, b) {
  const assert = a === b
  console.log(assert)
  return assert
}

sonIguales('hola', 'hola') // true
sonIguales('hola', 'mundo') // false
sonIguales('', 0) // false
sonIguales({}, {}) // false porque son objetos diferentes, creados dinámicamente
sonIguales([], []) // false porque son arrays diferentes, creados dinámicamente
sonIguales([], 0) // false

window.sonIguales = sonIguales

// Functional programming on JavaScript
// Composition
// https://medium.com/javascript-scene/composing-software-an-introduction-27b72500d6ea

const fn1 = (value) => `${value}h`
const fn2 = (value) => `${value}e`
const fn3 = (value) => `${value}l`
const fn4 = (value) => `${value}l`
const fn5 = (value) => `${value}o`
const capitalize = (str) => `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`

const numbers = [4, 10, 0, 27, 42, 17, 15, -6, 58]
const calculateMagicNumber = () => {
  return numbers
    .filter(number => number >= 10 && number <= 20)
    .reduce((acc, value) => acc + value)
}
const buildMessage = value => `The magic number is ${value}`

// see https://medium.com/javascript-scene/reduce-composing-software-fe22f0c39a1d
const compose = (...fns) => x => fns.reduceRight((value, fn) => fn(value), x)
const pipe = (...fns) => x => fns.reduce((value, fn) => fn(value), x)

/*
function compose (...fns) {
  return function (x) {
    return fns.reduceRight(function (value, fn) {
      return fn(value)
    }, x)
  }
}
*/

const printGreeting = compose(
  console.log,
  fn5,
  fn4,
  fn3,
  fn2,
  fn1
)

const printMagicNumber = pipe(
  calculateMagicNumber,
  buildMessage,
  console.log
)

printGreeting('')
printMagicNumber()

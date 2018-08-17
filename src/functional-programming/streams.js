// Functional programming
// Streams
//

// Stream as a JS generator (imperative way)
/*
function * naturalNumbers () {
  let n = 1

  while (true) {
    yield n++
  }
}
*/

// Stream as a JS generator (functional way)
/*
function * naturalNumbers () {
  function * _naturalNumbers (n) {
    yield n
    yield * _naturalNumbers(n + 1)
  }

  yield * _naturalNumbers(1)
}
*/

function naturalNumbers () {
  function _stream (n) {
    return {
      value: n,
      next () {
        return _stream(n + 1)
      }
    }
  }

  return () => _stream(1)
}

const nats = naturalNumbers()
const one = nats()
const two = one.next()
const three = two.next()

console.log(one.value) // 1
console.log(two.value) // 2
console.log(three.value) // 3

function fibonacciSequence () {
  function _stream (current, next) {
    return {
      value: current,
      next () {
        return _stream(next, current + next)
      }
    }
  }

  return () => _stream(0, 1)
}

const fibs = fibonacciSequence()
const firstFib = fibs()
const secondFib = firstFib.next()
const thirdFib = secondFib.next()

console.log(firstFib.value)
console.log(secondFib.value)
console.log(thirdFib.value)

function take (n, stream) {
  function _take (n, stream, acc) {
    if (n === 0) {
      return acc
    }

    const { value, next } = stream()

    return _take(n - 1, next, acc.concat(value))
  }

  return _take(n, stream, [])
}

const firstTenNats = take(10, nats)
const firstTenFibs = take(10, fibs)

console.log('First ten natural numbers', firstTenNats)
console.log('First ten Fibonacci numbers', firstTenFibs)

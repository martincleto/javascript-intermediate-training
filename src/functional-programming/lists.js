// Functional programming in JavaScript
// Lists
// https://blog.jeremyfairbank.com/javascript/functional-javascript-lists-1

/*
Example of list: 1 -> 3 -> 42 -> 28 -> Null

      (head, tail)
        /      \
       1     (head, tail)
                /     \
               3    (head, tail)
                      /      \
                     42    (head, tail)
                             /      \
                            28      Nil
*/

const Cons = function (head, tail) {
  this.head = head
  this.tail = tail
}

Cons.prototype.map = function (fn) {
  return new Cons(fn(this.head), this.tail.map(fn))
}

Cons.prototype.reduce = function (fn, acc) {
  return this.tail.reduce(fn, fn(acc, this.head))
}

Cons.prototype.reduceRight = function (fn, acc) {
  return fn(this.tail.reduceRight(fn, acc), this.head)
}

// Nil is declared as a singleton as it will be always the same object (no multiple instances needed)
const Nil = {
  get head () {
    throw new Error('Accessing head on empty list.')
  },

  get tail () {
    throw new Error('Accessing tail on empty list.')
  },

  map () {
    return this
  },

  reduce (fn, acc) {
    return acc
  }
}

Nil.reduceRight = Nil.reduce

const list = function (...args) {
  if (args.length === 0) return Nil

  const head = args[0]
  const tail = args.slice(1)

  return new Cons(head, list.apply(null, tail))
}

const numbers = list(1, 3, 42, 28)
const doubles = numbers.map(x => x * 2)
const total = numbers.reduce((a, b) => a + b, 0)

console.dir(doubles)
console.log(total)

var Robot = function (name) {
  this.name = name
}

function add (op1, op2) {
  this.name = this.name || 'Humans'
  return this.name + ' can count to ' + (op1 + op2)
}

var voltron = new Robot('Voltron')
var bender = new Robot('Bender Rodriguez')
var optimus = new Robot('Optimus Prime')
var megaman = new Robot('Mega Man')
var bmo = new Robot('B-Mo')
var wall_e = new Robot('Wall-E')

var result

// #1 invoke the add function with 2 arguments, 0 and 1
result = add(0, 1)
console.log(result)

// #2 invoke the add function within the context of the object named voltron, passing in 2 arguments, 2 and 3 (using call())
result = add.call(voltron, 2, 3)
console.log(result)

// #3 invoke the add function within the context of the object named optimus, passing in 2 arguments, 20 and 30 (using apply())
result = add.apply(optimus, [20, 30])
console.log(result)

// #4 bind the function add to a new function named calculate with the context of the object bender (using bind())
// invoke the calculate passing in 2 arguments, "drinking " and "beer"
function calculate (param1, param2) {
  var boundAdd = add.bind(bender, param1, param2)
  return boundAdd()
}

result = calculate('drinking', 'beer')
console.log(result)

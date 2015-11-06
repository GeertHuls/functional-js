
// http://jsbin.com/yumog/

/*
//Recap / implemenation of map:
var map = _.curry(function(f,obj) {
	return obj.map(f);
})

Container(3).map(add(1));
//=> Container(4)

map(add(1), Container(3))
//=> Container(4)
*/

console.clear();
var _ = R;
var P = PointFree;
var map = P.fmap;
var compose = P.compose;
var Maybe = P.Maybe;
var Identity = P.Id; // Identity is same like container


var mapDemo = map(function(x) {
	return x.toUpperCase();
}, Identity("firehose"));
//=> Identity(FIREHOSE)

console.log(mapDemo.val);
//=> "FIREHOSE"

//run function inside Identity

var mapDemo2 = map(function(x) {
	return x.reverse();
}, Identity([3, 2, 1]));
//=> Identity([1, 2, 3]])

console.log(mapDemo2.val);
//=> [1, 2, 3]

var mapDemo3 = map(function(x) {
	return x + 2;
}, [2]);
//=> [4]

//same but use map as instance method:
var mapResult = Identity(2).map(_.add(1));
//=> Identity(3)



// Exercise 1
// ==========
// Use _.add(x,y) and map(f,x) to make a function that increments a value inside a functor
console.log("--------Start exercise 1--------")

var ex1 = map(_.add(1));

assertDeepEqual(Identity(3), ex1(Identity(2)))
console.log("exercise 1...ok!")




// Exercise 2
// ==========
// Use _.head to get the first element of the list
var xs = Identity(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
console.log("--------Start exercise 2--------")


var ex2 = map(_.head);


assertDeepEqual(Identity('do'), ex2(xs))
console.log("exercise 2...ok!")






// Exercise 3
// ==========
// Use safeGet and _.head to find the first initial of the user
var safeGet = _.curry(function(x,o){ return Maybe(o[x]) })
var user = {id: 2, name: "Albert"}
console.log("--------Start exercise 3--------")

//console.log(safeGet("name", user)); // returns maybe

//var m1 = Maybe("Albert");
//var mf1 = map(_.head);
//console.log(mf1(m1).val);

var ex3 = map(map(_.head), safeGet("name"));

// OR compose also works:

//var ex3 = compose(map(_.head), safeGet("name"));

assertDeepEqual(Maybe('A'), ex3(user))
console.log("exercise 3...ok!")






// Exercise 4
// ==========
// Use Maybe to rewrite ex4 without an if statement
console.log("--------Start exercise 4--------")


//Original:
// var ex4 = function(n) {
//   if(n){
//     return parseInt(n);
//   }
// }

//New:
var ex4 = map(parseInt, Maybe);


assertDeepEqual(Maybe(4), ex4("4"))
console.log("exercise 4...ok!")


//Additional illustrations:
var a4b = function (s) {
  return s.replace('a', 'b');
}
var a4bs = map(a4b); //=> now this function will work on an array (or any other kind of functor)!
//=> take a standard function and make it work with any functor.
//=> lift standard function

var _Maybe.prototype.map = function(f) {
	return this.val ? Maybe(f(this.val)) : Maybe(null);
};
map(capitalize, Maybe("flamethrower"))
//=> Maybe("FLAMETHROWER")
// capitalize now runs IN maybe, we lifted it in there!





// TEST HELPERS
// =====================
function inspectIt(x){
  return (x.inspect && x.inspect()) || (x.toString && x.toString()) || x.valueOf(); //hacky for teachy.
}

function assertEqual(x,y){
  if(x !== y){ throw("expected "+x+" to equal "+y); }
}
function assertDeepEqual(x,y){
  if(x.val !== y.val) throw("expected "+inspectIt(x)+" to equal "+inspectIt(y));
}

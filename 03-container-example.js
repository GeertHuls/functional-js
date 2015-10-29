
var _Container = function(val) {
	this.val = val;
};

var Container = function(x) { return new _Container(x); };

Container(3)
// => _Container {val:3}
//Container is a wrapper

//Setup:
Container("flamethrower");
// => _Container("Flamethrower")

//Capitalize a string:
capitalize("flamethrower");
// => Flamethrower

//Capitalize a container objecct
capitalize(Container("flamethrower"));
// => [object, object] => not wat we want

//Solution, use map:
var _Container.prototype.map = function(f) {
	return Container(f(this.val));
}
//Run the function passed in as an argument on the value of the container.

Container("Flamethrower").map(function(s) { return capitalize(s); });
//or:
Container("Flamethrower").map(capitalize);
// => Container("Flamethrower")

//Map works on anything, not just looping over an array:
Container(3).map(add(1));
//=> Container(4)

//Map is generic which can also be applied on arrays, a function is mapped over it:
[3].map(add(1));
// [4]


//Changing types inside the container, since a container is never tied to 1 certain type:
Container([1, 2, 3]).map(reverse).map(first); //this is also composition...
//=> Container(3)

//The type inside the container changes from a string to an integer:
Container("flamethrower").map(length).map(add(1));
//=> Container(13)

//Objects
//-------
var map = _.curry(function(f, obj) {
	return obj.map(f);
})

Container(3).map(add(1)); //here the map function is part of the container object
//Container(4)

map(add(1), Container(3)); //this function is curried so second param 'Container(3)' is not necessary
//Container(4) 

map(match(/cat/g), Container("catsup"));
//=> Container(["Cat"])

map(compose(first, reverse), Container("dog"));
//=> Container("g²")

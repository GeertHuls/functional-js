
//Them pesky nulls

var getElement = document.querySelector;
var getNameParts = compose(split(''), get('value'), getElement);

getNameParts('#full_name');
//=> ['Jonathan', 'Gregory', 'Brandis']

//What if dom element full_name is not found?

getNameParts('#fullname');
//=> Error!

//Solution: use Maybe functor
// - Captures a null check
// - Sometimes has two sublclasses Just / Nothing
// - Sometimes call Option wiht subclasses Some / None


//Maybe:

var _Maybe.protoype.map = function(f) {
	return this.val ? Maybe(f(this.val)) : Maybe(null);
};

var Maybe = function(x) { return new _Maybe(x); };

map(capitalize, Maybe("flamethrower"));
//=> Maybe("Flamethrower")

map(capitalize, Maybe(null));
//=> Maybe(null)

//Other example:

var firstMatch = compose(first, match(/cat/g));

firstMatch("dogsup");
//=> Error! (first on null)

var firstMatch = compose(map(first), Maybe, match(/cat/g));

firstMatch("dogsup");
//=> Maybe(null)


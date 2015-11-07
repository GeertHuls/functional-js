
/*
Typically used for pure error handling.

Like Maybe, but with an error message embedded.

Has two subclasseses: Left/Right.

Maps the function over a Right ignores the Left.

*/

//Either high level:

map(function(x) { return x = 1; }, Right(2))
//=> Right(3)

map(function(x) { return x + 1 }, Left('some message'));
//=> Left('some message')


//Either example:

var determinAge = function(user) {
	return user.age ? Right(user.age) : Left("couldn't get age");
};

var yearOlder = compose(map(add(1)), determinAge);

yearOlder({age:22});
//=> Right(23)

yearOlder({age:null});
//=> Left("couldn't get age")

//Basically:
//	- if you want it to run, return Right
//	- if you want it to stop, return a Left


/*
IO

A lazy computation "builder", exists of a list of functions.

Typically used to contain side effects.

You must runIO to perform the opartion.

Map appends the function to a list of things to run with the effectful value.

*/

//IO

var email_io = IO(function() { return $("#email").val() });
var msg_io = map(concat("welcome"), email_io);

runIO(msg_io)
//=> "welcome steve@foodie.net"

var getBgColor = compose(get("background-color"), JSON.parse);
var bgPref = compose(map(getBgColor), Store.get("preferences")); //Store.get will return an IO!

var app = bgPref();
//=> IO()

runIO(app);
//=> #efefef

//runIO will not run all IO's in case there are nested IO's (and IO returning an IO for examples).
//This is where monads come into play, they bundle multiple IO's into just 1.


var email_io = IO(function() { return $("#email").val() }); //This will return an IO
var getValue = function(sel) { return $(sel).val() }.toIO(); //This will return an IO too
	//Except you'll have to use toIO for usage of arguments in the IO
	//Best practise: always use toIO()

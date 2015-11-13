
// Recognize map

/*
Customer names:


[x].map(f) // [f(x)] 								--> map(f,[x]) // [f(x)]
Maybe(x).attempt(f) // Maybe(f(x))					--> map(f, Maybe(x)) // Maybe(f(x))
Promise(x).then(f) // Promise(f(x))					--> map(f, Promise(x)) // Promise(f(x))
EventStream(x).subscribe(f) // EventStream(f(x)) 	--> map(f, EventStream(x)) // Eventstream(f(x))

*/

// Functor laws

//identity
map(id) == id;

//composition

compose(map(f), map(g)) == map(compose(f, g));

//Example:

//reverse :: String -> String
//toArray :: a --> Array a

var toArray = function(x) { return [x]; }

compose(toArray, reverse)("bingo")
//=> [ognib]

compose(map(reverse), toArray)("bingo")
//=> [ognib]

//Other examples

compose(toArray, compose(toUpper, reverse))("bingo");
//=> [OGNIB]

compose(map(toUpper), map(reverse), toArray)("bingo");
//=> [OGNIB]

compose(map(compose(toUpper, reverse)), toArray)("bingo");
//=> [OGNIB]


//Natural tranformations

// maybeToArray :: Maybe a -> Array a

maybeToArray(Maybe(2));
//=> [2]

maybeToArray(Maybe(null));
//=> []

//Examples:

compose(nt, map(f)) == compose(map(f), nt);

compose(maybeToArray, map(add(1)))(Maybe(5));
//=> [6]

compose(map(add(1)), maybeToArray)(Maybe(5));
//=> [6]

// Execise:


//Card game #1
//Make an api call with an id and possibly retrieve a post

//Answer:
Future(Maybe(Post));

//This is not a single solution, you also could use an Either.

//Card game #2
//Click a navigation link and insert the corresponding html on the page

//Answer:
Eventstream(IO(Dom));
//Putting it on the page is IO.

//Card game #3
//Submit a signup form & return erros or make an API call that will create a user

//Answer:
Eventstream(Either(Future(User)));
//These are diferrent type, so you'll have map 3 times.
//These are 3 different contexts that are nested.

//Pointed Functors

//of :: a -> F a
//'of' takes an 'a' and puts is in some kind of type/container.

//also known as: pure, return, unit, point (a pointed functor)
//Anything with a map method and an of method is a pointed functor.


Container.of(split);
//=> Container(split)

Maybe.of(reverse);
//=> Maybe(reverse)


Future.of(match(/dubstep/));
//=> Future(match(/dubstep/))

Eventstream.of(replace(/dubstep/, 'shoegaze'));
// EventStream(match/dubstep/, 'shoegaze')

//An 'of' method is better than a constructor. Because it will put whatever you have into the context.
//It doesn't even have to be what is expected in the first place.


//Monads

//Nest computations

//functions: mjoin, chain
//All a monad does is joining functors togheter.
//A monad is a pointed functor with an extra function called 'mjoin' and/or 'chain'.

//mjoin :: M M a -> M a
//A container of a container of a just gives a container of a. Nested containers just return 1 container.
//chain :: (a -> M b) -> M a -> M b

//Pointed Functor + mjoin|chain = Monad

//Examples:

mjoin(Container(Container(2)));
//=> Container(2)

//Other example:

var getTrackingId = compose(Maybe, get("tracking_id"));
var findOrder = compose(Maybe, Api.findOrder);
var getOrderTracking = compose(map(getTrackingId), findOrder);
//There are 2 maybes returned...

var renderPage = compose(map(map(renderTemplate)), getOrderTracking);
				//... so you'll have to map twice over them and then render the template.
renderPage(379);
//=> Maybe(Maybe(Html))

//This will happen if you keep combining or composing contexts.

//Solution: use mjoin!


var getTrackingId = compose(Maybe, get("tracking_id"));
var findOrder = compose(Maybe, Api.findOrder);
var getOrderTracking = compose(mjoin, map(getTrackingId), findOrder);
		//mjoin usage here, at the point where it gets nested, we just join it.
var renderPage = compose(map(renderTemplate), getOrderTracking);
renderPage(379);
//=> Maybe(Html)

//Another monad example:

var setSearchInput = function(x) { return ("#input").val(x); }.toIO();
var getSearchTerm = function() { return getParam("term", location.search) }.toIO();
var initSearchForm = compose(map(setSearchInput), getSearchTerm);

initSearchForm()
//=> IO(IO(Dom))

map(runIO, initSearchForm());
//This will only run io against the first io, so you'll have to call another io against the second one too.

//Solution, use mjoin!

var setSearchInput = function(x) { return ("#input").val(x); }.toIO();
var getSearchTerm = function() { return getParam("term", location.search) }.toIO();
var initSearchForm = compose(mjoin, map(setSearchInput), getSearchTerm);

initSearchForm()
//=> IO(Dom)

map(runIO, initSearchForm());
//There is only 1 IO to run against.

//mjoin is like map, it will call whatever object it gets.
//If it get a Maybe(Maybe), it is going to the Maybe type asking how to join them.
//A Maybe, Evenstream, IO, etc are all monads (and are also functors).
//A monad is a functor that has an 'of' method.

//In case of a tripple Maybe(Mabye(Maybe)), you'll have to mjoin twice.
//Mjoining twice is not a big deal because there are ways to compose monads.
//Normally you should not mjoin twice...

//Yet another example:

var sendToServer = httpGet('/upload');
var uploadFromFile = compose(mjoin, map(sendToServer), readFile);
						// sendToServer is a Future in a Future
uploadFromFile("/tmp/my_file.txt").fork(logErr, alertSuccess);

//Next example:

var sendToServer = httpGet('/upload');
var uploadFromFile = compose(mjoin, map(sendToServer), mjoin, map(readFile), askUser);
// 							again join 2 futures	join 2 futures		askUser is a future value

//In a node app this would look like 3 nested callback functions.

uploadFromFile('what file?').fork(logErr, alertSuccess);

//note: it is not possible to mjoin functors of different types. To do so, you will need a monad transformer or use the lens library to define the double map.

//Monad Chain explained

var chain = function(f) {
	return compose(mjoin, map(f));
}

//also known as: flatMap, bind

//Example:

var sendToServer = httpGet('/upload');
var uploadFromFile = compose(chain(sendToServer), chain(readFile), askUser);
						//replace mjoin with chain
uploadFromFile('what file?').fork(logErr, alertSuccess);

//Chain use dot syntax:

var sendToServer = httpGet('/upload');

var uploadFromFile = function(what) {
	return askUser(what).chain(readFile).chain(sendToServer);
}

//dot sytax vs piont free style.

uploadFromFile('what file?').fork(logErr, alertSuccess);

//Finally:

var chain = function(f) {
	return compose(mjoin, map(f));
}

var mjoin = chain(id);
//Chain says: open up the monad/contianer and id just returns the value. Basically this is mjoin.

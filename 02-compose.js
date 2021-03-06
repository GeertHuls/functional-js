
// http://jsbin.com/jevag
var _ = R;
var get = _.curry(function(x, obj) { return obj[x]; });


/******************************************
    C O M P O S I T I O N  E X A M P L E
******************************************/

// Curried functions are easy to compose.
// Using _.map, _.size, and _.split we can
// make a function that returns the lengths
// of the words in a string.

var lengths = _.compose(
  _.map(_.size), _.split(' ')
);
console.log(lengths('once upon a time'));


/*******************************************
               Y O U R  T U R N
********************************************/

var articles = [
  {
    title: 'Everything Sucks',
    url: 'http://do.wn/sucks.html',
    author: {
      name: 'Debbie Downer',
      email: 'debbie@do.wn'
    }
  },
  {
    title: 'If You Please',
    url: 'http://www.geocities.com/milq',
    author: {
      name: 'Caspar Milquetoast',
      email: 'hello@me.com'
    }
  }
];

// -- Challenge 1 -------------------------
// Return a list of the author names in
// articles using only get, _.compose, and
// _.map.


var names = _.map(
  _.compose( get('name'), get('author'))); // change this

assertEqualArrays(
  ['Debbie Downer', 'Caspar Milquetoast'],
  names(articles)
);

// -- Challenge 2 -------------------------
// Make a boolean function that says whether
// a given person wrote any of the articles.
// Use the names function you wrote above
// with _.compose and _.contains.


//Compose performs right to left composition:
//The contains method expects a second parameter, an array which is provided by the names function as an output after processing the articles.
var t = _.compose(_.contains('Debbie Downer'), names) (articles);
console.log(t);


var isAuthor = function (name, articles){
  return _.compose(_.contains(name), names) (articles);
}; // change this

assertEqual(
  false,
  isAuthor('New Guy', articles)
);
assertEqual(
  true,
  isAuthor('Debbie Downer', articles)
);

// -- Challenge 3 -------------------------
// There is more to point-free programming
// than compose! Let's build ourselves
// another function that combines functions
// to let us write code without glue variables.

// Point-free programing: a function is composed out of other funcions, without any kinds of parameters.

var fork = _.curry(function(lastly, f, g, x) {
  return lastly(f(x), g(x));
});

// As you can see, the fork function is a
// pipeline like compose, except it duplicates
// its value, sends it to two functions, then
// sends the results to a combining function.
//
// Your challenge: implement a function to
// compute the average values in a list using
// only fork, _.divide, _.sum, and _.size.

var avg = fork(_.divide, _.sum, _.size); // change this
assertEqual(3, avg([1,2,3,4,5]));



console.log("All tests pass.");

/******************************************
        B A C K G R O U N D  C O D E
*******************************************/

function assertEqualArrays(x,y) {
  if(x.length !== y.length)
    throw("expected "+x+" to equal "+y);
  for(var i in x) {
    if(x[i] !== y[i]) {
      throw("expected "+x+" to equal "+y);
    }
  }
}
function assertEqual(x,y){
  if(x !== y)
    throw("expected "+x+" to equal "+y);
}
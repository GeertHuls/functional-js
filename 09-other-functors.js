
//EventStream
/*
An inifite list of results..

Dual of array.

Its map is sometimes lazy.

Calls the mapped function each time on event happens.
*/

//Example(s)
var id_s = map(function() { return '#' + e.id }, Bacon.fromEventTarget(document, "click"));
//=> EventStream(String)

ids_s.onValue(function(id) { alert('you clicked' + id) });

var element_s = map(document.querySelector, id_s); //Because EventStream is a functor, you can map it to anything
//=> EventStream(Element)

element_s.onValue(function(el) { alert('The inner html is ' + el.innerHTML) });

//More EventStream examples (FRP)

var hover_s = Bacon.fromEventTarget(document, "hover");

var element_s = map(compose(document.querySelector, get('id')), hover_s);

var postid_s = map(function(el) { return el.data('post-id')}, element_s);

var future_post_s = map(Api.getProductById, postid_s);

//=> EventStream(Future(Post))
//Whenever the first event happens (hover in this case), the rest of streams just kicks off!

future_post_s.onValue(alert);


//Future
/*
Has an eventual value.

Similar to a promise, but it's "lazy".

You must fork it ot kick it off.

It takes a function as it's value.

Calls the function with it's result once it's there.
*/

//Examples

var makeHtml = function(post) { return "<div>" + post.title + "</div>"};
var page_f = map(makeHtml, http.get('/posts/2')); //http.get will return a future

page_f.fork(function(err) { throw(err)},
			function(page) { $('#container').html(page)});

//-----------------------------------------------------------------------

var makeHtml = function(title) { return "<div>" + title + "</div>"};
var createPage = compose(makeHtml, get('title'));
var page_f = compose(map(createPage), http.get('/posts/2'));

page_f.fork(function(err) { throw(err)},
			function(page) { $('#container').html(page)});


var lineCount = compose(length, split(/\n/));
var fileLineCount = compose(map(lineCount), readFile); //readFile returns the future
	//readFile is a node function, instead of writing call backs hell, you can map over 
	//asynchronous functions.

fileLineCount("mydoc.txt").fork(log, log);
//=> 34

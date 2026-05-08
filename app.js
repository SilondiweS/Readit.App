var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var posts = [];

app.get('/', function(req, res) {
	res.render('index', {
		currentTime: (new Date()),
		posts: posts
	});
});

app.post('/post/new', function(req, res) {
	var newPost = {
		title: req.body.title,
		body: req.body.body,
		author: req.body.author,
		slug: req.body.title.toLowerCase().replace(/ /g, '-'),
		date: (new Date()),
		comments: [],
		vote: 0
	}
	posts.push(newPost);
	res.redirect('/');
});

function findPostBySlug(slug) {
	var postObject = null;
	
	for (var i=0; i<posts.length; i++) {
		if (posts[i].slug == slug) {
			return posts[i];
		}
	}
	
	return null;
}

app.get('/post/:slug', function(req, res) {
	var postObject = findPostBySlug(req.params.slug);
	if (postObject == null) {
		res.redirect('/');
	} else {
		res.render('post', postObject);
	}
});

app.post('/post/:slug/comment/add', function(req, res) {
	var postObject = findPostBySlug(req.params.slug);
	postObject.comments.push(req.body);
	
	res.redirect('/post/' + req.params.slug);
});

app.all('/post/:slug/vote/:direction', function(req, res) {
	var postObject = findPostBySlug(req.params.slug);
	
	if (req.params.direction == 'up')
		postObject.vote++;
	else
		postObject.vote--;
	
	res.redirect('/post/' + req.params.slug);
});


module.exports = app;

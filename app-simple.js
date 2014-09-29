var express = require('express'),
    ArticleProvider = require('./articleprovider-mongodb').ArticleProvider,
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

    app = module.exports = express(),
    env = process.env.NODE_ENV || 'development';


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.use(bodyParser());
app.use(methodOverride());
app.use(require('stylus').middleware({ src: __dirname + '/xtyle' }));
app.use(express.static(__dirname + '/xtyle'));
app.use(clientErrorHandler);
app.use(errorHandler);


function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something blew up!' });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

//var articleProvider= new ArticleProvider();
var articleProvider = new ArticleProvider('localhost', 27017);

app.get('/', function(req, res){
  articleProvider.findAll( function(error,docs){
    res.render('index.jade',
      {
        title : 'Recent posts',
        articles : docs
      });
  });
});

/*app.get('/blog/new', function(req, res) {
    res.render('blog_new.jade',
      {
        title: 'New Post'
      });
});*/

app.post('/', function(req, res){
    if(req.param('title') && req.param('body')){
      articleProvider.save({
          title: req.param('title'),
          body: req.param('body')
      }, function( error, docs) {
          res.redirect('/');
      });
    }else{
      res.redirect('/');
    }
});

app.get('/blog/:id', function(req, res) {
    articleProvider.findById(req.params.id, function(error, article) {
        res.render('blog_show.jade',
        {
          title: article.title,
          article : article
        });
    });
});

app.post('/blog/addComment', function(req, res) {
  if(req.param('person') && req.param('comment')){
    articleProvider.addCommentToArticle(req.param('_id'), {
        person: req.param('person'),
        comment: req.param('comment'),
        created_at: new Date()
       } , function( error, docs) {
           res.redirect('/blog/' + req.param('_id'));
       });
  }else{
    res.redirect('/blog/' + req.param('_id'));
  }
});

app.listen(4040);

//console.log("Express server listening on port %d in %s mode", 4040, app.settings.env);
console.log("Server running at: http://0.0.0.0:%d", 4040);

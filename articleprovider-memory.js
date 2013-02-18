var articleCounter = 1;

ArticleProvider = function () {}; //constructor

ArticleProvider.prototype.dummyData = []; //holds data

// Return all data
ArticleProvider.prototype.findAll = function ( callback ) {
  callback ( null, this.dummyData );
};

// Return data based on ID number
ArticleProvider.prototype.findById = function ( id, callback ) {
  var result = null;
  for ( var i =0; i < this.dummyData.length; i++ ) {
    if ( this.dummyData[i]._id == id ) {
      result = this.dummyData [ i ];
      break;
    }//if
  }//for
  callback ( null, result );
};

// Insert new records on data
ArticleProvider.prototype.save = function ( articles, callback ) {
  var article = null;

  if ( typeof( articles.length ) == "undefined" ) {
    articles = [ articles ];
  }//if

  for ( var i =0; i < articles.length; i++ ) {
    article = articles[ i ];
    article._id = articleCounter++;
    article.created_at = new Date ();

    if ( article.comments === undefined ) {
      article.comments = [];
    } else {
      for ( var j = 0; j < article.comments.length; j++ ) {
        article.comments[ j ].created_at = new Date();
      }//for
    }//if_else
    // Includes data to the end of array
    this.dummyData[ this.dummyData.length ] = article;  
  }//for
  callback( null, articles );
};

/* Lets bootstrap with dummy data */
new ArticleProvider().save([
  {title: 'Post one', body: 'Body one', comments:[{author:'Bob', comment:'I love it'}, {author:'Dave', comment:'This is rubbish!'}]},
  {title: 'Post two', body: 'Body two'},
  {title: 'Post three', body: 'Body three'}
], function(error, articles){});

exports.ArticleProvider = ArticleProvider; //gives NodeJS main application access to stored data
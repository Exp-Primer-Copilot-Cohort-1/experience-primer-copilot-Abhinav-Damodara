// Create web server
// npm install express
// npm install body-parser
// npm install mongoose
// npm install nodemon
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comments = require('./model/comments');

// Connect to Mongoose
mongoose.connect('mongodb://localhost/comments');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(req, res, next) {
  console.log('Something is happening.');
  next();
});

router.get('/', function(req, res) {
  res.json({message: 'API Initialized!'});
});

router.route('/comments')
  .post(function(req, res) {
    var comments = new Comments();
    comments.author = req.body.author;
    comments.text = req.body.text;

    comments.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({message: 'Comment successfully added!'});
    });
  })
  .get(function(req, res) {
    Comments.find(function(err, comments) {
      if (err) {
        res.send(err);
      }
      res.json(comments);
    });
  });

router.route('/comments/:comment_id')
  .put(function(req, res) {
    Comments.findById(req.params.comment_id, function(err, comments) {
      if (err) {
        res.send(err);
      }
      (req.body.author) ? comments.author = req.body.author : null;
      (req.body.text) ? comments.text = req.body.text : null;

      comments.save(function(err) {
        if (err) {
          res.send(err);
        }
        res.json({message: 'Comment has been updated!'});
      });
    });
  })
  .delete(function(req, res) {
    Comments.remove({_id: req.params.comment_id}, function(err, comments) {
      if (err) {
        res.send(err);
      }
      res.json({message: 'Comment has been deleted!'});
    });
  });

app.use('/api', router);

app.listen(port, function() {
  console.log('API running on port ' + port);
});
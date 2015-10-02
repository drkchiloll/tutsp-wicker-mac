var Firebase = require('firebase');

var firebase = new Firebase('https://wicker-mac.firebaseio.com/');
var users = firebase.child('users');

function hash(password) {
  return require('crypto').createHash('sha512').update(password).digest('hex');
}

var router = require('express').Router();

router.use(require('body-parser').json());
router.use(require('cookie-parser')());
router.use(require('express-session')({
  resave : false,
  saveUnitialized : true,
  secret : 'a;ldjfaekurta;ldkjfpoeiua;lkdfj'
}));

router.post('/api/signup', function(req, res) {
  var username = req.body.username,
      password = req.body.password;
  if(!username || !password)
    return res.json({signedIn:false, message:'no username or password'});
  users.child(username).once('value', function(snapshot) {
    if(snapshot.exists()) {
      return res.json({signedIn : false, message : 'username already in use'});
    } else {
      var userObj = {
        username : username,
        passwordHash : hash(password)
      };

      users.child(username).set(userObj);
      req.session.user = userObj;

      res.json({signedIn : true, user : userObj});
    }
  })
});

router.post('/api/signin', function(req, res) {
  var username = req.body.username,
      password = req.body.password;
  if(!username || !password)
    return res.json({signedIn:false, message:'no username or password'});

  users.child(username).once('value', function(snapshot) {
    if(!snapshot.exists() ||
          snapshot.child('passwordHash').val() !== hash(password)) {
      return res.json({signedIn : false, message : 'wrong username or password'});
    } else {
      var user = snapshot.exportVal();
      req.session.user = user;
      res.json({signedIn : true, user : user});
    }
  });
});

router.post('/api/signout', function() {
  delete req.session.user;
  res.json({ signedIn : false, message : 'You have been signed out'});
});

module.exports = router;

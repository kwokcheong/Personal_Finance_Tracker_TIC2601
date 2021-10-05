const express = require('express');
const router = express.Router();

//username and password
const myusername = 'user1@hotmail.com'
const mypassword = 'mypassword'

/* GET users listing. */
router.post('/',(req,res) => {
  if(req.body.username == myusername && req.body.password == mypassword){
      session=req.session;
      session.userid=req.body.username;
      console.log(req.session)
      // res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
      res.redirect('../')
  }
  else{
    res.redirect('../invalid')
  }
})


module.exports = router;

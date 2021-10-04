const express = require('express');
const router = express.Router();

//username and password
const myusername = 'user1'
const mypassword = 'mypassword'

/* GET users listing. */
router.post('/user',(req,res) => {
    
  console.log(req.session)
  if(req.body.username == myusername && req.body.password == mypassword){
      session=req.session;
      session.userid=req.body.username;
      console.log(req.session)
      res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
  }
  else{
      res.send('Invalid username or password');
  }
})


module.exports = router;

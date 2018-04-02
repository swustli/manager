var express = require('express');
var mysql  = require('mysql');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'test'
  });
	connection.connect();
	var  sql = 'select t.id,t.student,t.track,(select a.category from category a where a.id=t.cateId)category,(select b.sitename from site b where b.id=t.siteId)site,t.time FROM details t';
  	//查
  	connection.query(sql,function (err, result) {
          if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
          }
          for (var i = 0; i < result.length; i++) {
            var date2 = new Date(result[i].time);
            var localeString = date2.toLocaleString();
            result[i].time = localeString;
          }
         res.render('index', {posts:result}); 
  	});
  	connection.end();
});

router.get('/add',function(req,res,next){
  var post = {
    "student" : "",
    "track" : "",
    "cateId" : "",
    "siteId" : "",
    "time" : "",
    "id" : "",
    "cateList":[],
    "siteList":[]
  }
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'test'
  });
  connection.connect();
  var sql = "select * from category";
  connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        } 
        post.cateList = result;
  });
  sql = "select * from site";
  connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        } 
        post.siteList = result;

        res.render('addDetails', { post:post });
  });
  connection.end();
});

router.post('/add',function(req,res){
	var student = req.body.student,
		track = req.body.track,
		category = req.body.cateId,
		site = req.body.siteId,
		time = req.body.time;
    //console.log(category);
  	if(student != ""){
      var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 'test'
      });
  		connection.connect();
  		
  		sql = "INSERT INTO details(student,track,cateId,siteId,time) VALUES(?,?,?,?,?)";
  		var  addSqlParams = [student, track,category, site,time];
      //console.log(addSqlParams);
  		connection.query(sql,addSqlParams,function (err, result) {
  	        if(err){
  	         console.log('[INSERT ERROR] - ',err.message);
  	         return;
  	        }        
  	       console.log('INSERT ID:',result);        
  		});
	  	connection.end();
	  	res.redirect('/');//返回注册页
	}
	
});

router.get('/updateDetails/:id',function(req,res,next){
  var post = {
    "student" : "",
    "track" : "",
    "cateId" : "",
    "siteId" : "",
    "time" : "",
    "id" : "",
    "cateList":[],
    "siteList":[]
  }
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'test'
  });
  var id = req.params.id;
  connection.connect();
  var sql = "select * FROM details t where t.id='"+id+"'";
  //查
  connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
        post.id = result[0].id;
        post.student = result[0].student;
        post.track = result[0].track;
        post.cateId = result[0].cateId;
        post.siteId = result[0].siteId;

        var date2 = new Date(result[0].time);
        var localeString = date2.toLocaleString();
        post.time = localeString;
       //res.render('addDetails', { post:result[0] }); 
  });
  var sql = "select * from category";
  connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        } 
        post.cateList = result;
  });
  sql = "select * from site";
  connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        } 
        post.siteList = result;

        res.render('addDetails', { post:post });
  });
  connection.end();
});

router.post('/updateDetails/:id',function(req,res){
  var student = req.body.student,
    track = req.body.track,
    category = req.body.cateId,
    site = req.body.siteId,
    time = req.body.time;
    id = req.body.id;
    if(id && id != ""){
      var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 'test'
      });
      connection.connect();
      
      sql = "UPDATE details SET student = ?,track = ?,cateId = ?,siteId = ?,time = ? WHERE id = ?";
      var  addSqlParams = [student, track,category, site,time,id];
      //console.log(addSqlParams);
      connection.query(sql,addSqlParams,function (err, result) {
            if(err){
             console.log('[UPDATE ERROR] - ',err.message);
             return;
            }        
           console.log('UPDATE affectedRows',result.affectedRows);     
      });
      connection.end();
      res.redirect('/');
  }
  
});

router.get('/delDetails/:id',function(req,res,next){
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'test'
  });
  var id = req.params.id;
  connection.connect();
  var sql = "select * FROM details t where t.id='"+id+"'";
  //查
  connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
        var date2 = new Date(result[0].time);
        var localeString = date2.toLocaleString();
        result[0].time = localeString;
       res.render('delDetails', { post:result[0] }); 
  });
  connection.end();
});

router.post('/delDetails/:id',function(req,res){
    var id = req.params.id;
    console.log(id);
    if(id && id != ""){
      var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 'test'
      });
      connection.connect();
      
      sql = "delete from details WHERE id = '"+id+"'";
      connection.query(sql,function (err, result) {
            if(err){
             console.log('[DELETE ERROR] - ',err.message);
             return;
            }        
           console.log('DELETE affectedRows',result.affectedRows);     
      });
      connection.end();
  }else{
      console.log("id为空！"); 
  }
  res.redirect('/');
});



router.get('/category', function(req, res, next) {
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'test'
  });
	connection.connect();
	var  sql = 'select * from category ';
  	//查
  	connection.query(sql,function (err, result) {
          if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
          }
   
         console.log('--------------------------SELECT----------------------------');
         res.render('category', {posts:result});
         console.log('------------------------------------------------------------\n\n');  
  	});
  	connection.end();
});

router.get('/site', function(req, res, next) {
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'root',
      database : 'test'
    });
  	connection.connect();
	var  sql = 'select * from site ';
  	//查
  	connection.query(sql,function (err, result) {
          if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
          }
   
         console.log('--------------------------SELECT----------------------------');
         res.render('site', {posts:result});
         console.log('------------------------------------------------------------\n\n');  
  	});
  	connection.end();
});


module.exports = router;

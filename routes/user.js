
//rest api to get all results ==========================================================================================

exports.users = function(req, res){

  req.getConnection(function(err,connection){
       
        connection.query('SELECT * FROM MOCK_DATA', function(err,results, fields)
        {
            console.log(results);

            if(err) {
                  res.json({"Error" : true, "Message" : "Error executing MySQL query"});
                  return
               } else {
                  res.end(JSON.stringify(results));
               }

            
                
           
         });
    });

  
};

//rest api to get a single user data ===================================================================================

exports.users_id = function(req, res){
    console.log(req);
    var id = req.params.id;
    
    req.getConnection(function(err,connection){
       
        connection.query('SELECT * FROM MOCK_DATA WHERE id = ?',[id],function(err,results)
        {
            
            if (results.length > 0 && !isNaN(id)) {
               res.end(JSON.stringify(results));
            } else {
               res.json({"Error" : true, "Message" : "Error id user not found "});
            }
            if(err)
                console.log("Error Selecting : %s ",err );
     
            
              
           
         });
         
    }); 
};

//rest api to create a new user into mysql database ====================================================================

exports.users_new = function(req, res){
    var postData  = req.body;
    var name= postData.Username;
    
    req.getConnection(function(err,connection){
        
        var sql = 'SELECT * FROM MOCK_DATA WHERE Username = ' + connection.escape(name);
        connection.query(sql, function(err, row) {
            if(row.length == 0) {
               connection.query('INSERT INTO MOCK_DATA SET ?', postData, function (error, results, fields) 
               {
                  if(err)
                      console.log("Error Inserting : %s ",err );
           
                  res.end(JSON.stringify(results));
              
           
               });

            } else {
               res.json({"Error" : true, "Message" : "User already exists"}); 
            }
        });
   }); 
};

//rest api to update user data into mysql database =====================================================================

exports.users_update = function(req,res){
    var putData  = req.body;
    var name= putData.Username;

   req.getConnection(function(err,connection){

      var sql = 'SELECT * FROM MOCK_DATA WHERE Username = ' + connection.escape(name);
      connection.query(sql, function(err, row) {
            if(row.length == 0) {
              connection.query("UPDATE MOCK_DATA SET `first_name`=?,`last_name`=?,`email`=?, `password`=?, `Username`=? where `id`=? ",[req.body.first_name,req.body.last_name, req.body.email, req.body.password, req.body.Username, req.body.id], function (error, results, fields) 
              {
     
                if (error) throw error;
                  res.end(JSON.stringify(results));      
                }); 

            } else {
               res.json({"Error" : true, "Message" : "User already exists"}); 
            }
        });
   });
};

// rest api to delete user from mysql database =========================================================================

exports.users_delete = function(req,res){
    var delData  = req.body;
    var id= delData.id;

    console.log(req.body);
    req.getConnection(function(err,connection){
       var sql = 'SELECT * FROM MOCK_DATA WHERE id = ' + connection.escape(id);
      connection.query(sql, function(err, row) {
         console.log(row.length);
            if(row.length > 0) {
              connection.query('DELETE FROM `MOCK_DATA` WHERE `id`=?', [req.body.id], function (error, results, fields) 
               {
     
                if (error) throw error;
                  res.end('Record has been deleted!'); 
               
               });

            } else {
               res.json({"Error" : true, "Message" : "the id is not in the database"}); 
            }
        });
   });
};


/*

*/

// signup page call  ======================================================================

exports.signup = function(req, res){

   req.getConnection(function(err,connection){
   
   message = '';

      if(req.method == "POST"){

               var post  = req.body;
               var fname= post.first_name;
               var lname= post.last_name;
               var email= post.email;
               var pass= post.password;
               var name= post.Username;
               
               

                  var sql = 'SELECT * FROM MOCK_DATA WHERE Username = ' + connection.escape(name) + ' OR email = ' + connection.escape(email);
                  connection.query(sql, function(err, row) {
                     if(row.length == 0) {
                        
                        var sqlInsert = "INSERT INTO `MOCK_DATA`(`first_name`,`last_name`,`email`,`password`, `Username`) VALUES ('" + fname + "','" + lname + "','" + email + "','" + pass + "','" + name + "')";
                        
                        connection.query(sqlInsert, function (error, results, fields) 
                       {
              
                         if (error) throw error;
                           res.json({ success: true, message: 'Succesfully! Your account has been created.'  });      
                         }); 

                     } else {
                           res.json({"Error" : true, "Message" : "Username or email already exists"}); 
                     }
                  });
               

      } else {
                     res.render('signup');
      }

   });
};
 
// login page call =======================================================================
exports.login = function(req, res){

   req.getConnection(function(err,connection){

      var message = '';
      var sess = req.session; 

      if(req.method == "POST"){
         var post  = req.body;
         var first_name = post.first_name;
         var last_name = post.last_name;
         var name= post.Username;
         var pass= post.password;
         
         
            
            var sql="SELECT id, first_name, last_name, Username FROM `MOCK_DATA` WHERE `Username`='"+name+"' and password = '"+pass+"'";                           
            
            var query = connection.query(sql, function(err, results){ 

               if(results.length != 0){
                  req.session.userId = results[0].id;
                  req.session.user = results[0];
                  console.log(results[0].id);

                  //Para efectos del test si se desea unir todo 
                  //solo basta con comentar la siguiente linea
                  res.json({ success: true, message: 'Welcome! '+results[0].first_name+' '+results[0].last_name+'. Your username is : '+name+''});
                  // Y descomentar la siguiente linea
                  //res.redirect('/home/dashboard');
               }
               else{
                  //message = 'Wrong Credentials.';
                  //res.render('index.ejs',{message: message});
                  res.json({ success: false, message: 'Authentication failed. Wrong Credentials.' });
               }
                       
            });
         
            
         } else {
            res.render('index.ejs',{message: message});
         }
   });        
};

// dashboard page functionality =====================================================================
           
exports.dashboard = function(req, res, next){

   req.getConnection(function(err,connection){
           
         var user =  req.session.user,
         userId = req.session.userId;
         console.log('ddd='+userId);
         if(userId == null){
            res.redirect("/login");
            return;
         }

         var sql="SELECT * FROM `MOCK_DATA` WHERE `id`='"+userId+"'";

         var query = connection.query(sql, function(err, results){
            res.render('dashboard.ejs', {user:user});    
         });
  });      
};

// logout functionality =============================================================================

exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};

// render user details after login  =================================================================

exports.profile = function(req, res){

   req.getConnection(function(err,connection){

         var userId = req.session.userId;
         if(userId == null){
            res.redirect("/login");
            return;
         }

         var sql="SELECT * FROM `MOCK_DATA` WHERE `id`='"+userId+"'";          
         var query = connection.query(sql, function(err, result){  
            res.render('profile.ejs',{data:result});
         });

   });
};

// edit users details after login ===================================================================

exports.editprofile=function(req,res){

   req.getConnection(function(err,connection){
      
      var userId = req.session.userId;
      if(userId == null){
         res.redirect("/login");
         return;
      }

      var sql="SELECT * FROM `MOCK_DATA` WHERE `id`='"+userId+"'";
      var query = connection.query(sql, function(err, results){
         res.render('edit_profile.ejs',{data:results});
      });

   });
};

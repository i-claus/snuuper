/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

//load users route =============================================================

var user = require('./routes/user')
var app = express();
var connection  = require('express-myconnection'); 
var mysql = require('mysql');
var session = require('express-session');
var bodyParser=require("body-parser");

// all environments ================================================================

app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 60000 }
            }))

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// connection ======================================================================

app.use(

    connection(mysql,{
        
        host: 'localhost',
        user: 'root',
        password : '',
        port : 3306, //port mysql
        database:'snuuper'
    },'request')
    
);

// routes =========================================================================

app.get('/', routes.index); //route index

app.get('/users', user.users); //rest api to get all results
app.get('/users/:id', user.users_id); //rest api to get a single employee data
app.post('/users', user.users_new); //rest api to create a new record into mysql database
app.put('/users', user.users_update); //rest api to update record into mysql database
app.delete('/users', user.users_delete); //rest api to delete record from mysql database

app.get('/signup', user.signup);//call for signup page
app.post('/signup', user.signup);//call for signup post 
app.get('/login', routes.index);//call for login page
app.post('/login', user.login);//call for login post
app.get('/home/dashboard', user.dashboard);//call for dashboard page after login
app.get('/home/logout', user.logout);//call for logout
app.get('/home/profile',user.profile);//to render users profile


app.use(app.router);
http.createServer(app).listen(app.get('port'), function(){
  console.log('The magic happens on port ' + app.get('port'));
});
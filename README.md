# snuuper backend 


<b><u>Instrucciones</u></b>

<b>Step 1:</b><br>
       Se debe importar el archivo <b>snuuper.sql</b> en un motor de base de datos MySQL (por ejemplo <u>Xampp</u>)

<b>Step 2:</b><br>
       Se debe instalar nodeJS<br> 
       <b>brew install nodejs</b><br>

<b>Step 3:</b><br>
      Se debe instalar los modulos necesarios.<br>
        <b>npm install</b><br>
        <b>npm install mysql</b><br>

<b>Step 4:</b><br>
      Iniciar el servidor con el comando <b>node app.js</b><br>
      
      
<b><u>Test</u></b><br>

Para hacer test de los servicios se debe iniciar el navegador con la siguiente direccion local<br>
<b>http://localhost:4300/</b>

<b><u>Rutas de Servicios</u></b><br>
Los siguientes servicios fueron construidos junto con una interfaz grafica para poder usarlo y hacerlo un poco más fácil,<br>
pero se hicieron servicios con json para poder cumplir con los requerimientos<br><br>

<b>/</b><br>
<b>/users</b> --> rest api to get all results (get)<br>
<b>/users/:id</b> --> rest api to get a single user data (get)<br>
<b>/users</b> --> rest api to create a new user into mysql database (post)<br>
<b>/users</b> --> rest api to update record into mysql database (put)<br>
<b>/users</b> --> rest api to delete record from mysql database (delete)<br>

<b>/signup</b> --> call for signup page<br>
<b>/login</b> --> call for login page<br>
<b>/home/dashboard</b> --> call for dashboard page after login<br>
<b>/home/logout</b> --> call for logout<br>
<b>/home/profile</b> --> to render users profile<br>


Nota: En caso que se quiera unir el <b>/login</b> con <b>/customers</b> al momento hacer login con datos, solo se debe seguir las instrucciones de <b>/routes/user.js</b> en la <b>linea 66</b><br>
Tambien se adjunta <b>Postman collection</b>.

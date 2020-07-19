# Mean-App-Backend

Start the mongodb server on your machine and create `analytics` database.<br>
In analytics create this collections [unique_global_visitors, website_visits]

Open terminal in the cloned directory

`cd Mean-App-Backend`
`npm install`

dir structure :

Mean-App-Backend<br>
|&emsp;----model<br>
|&emsp;&emsp; |-> connection.js<br>
|&emsp; &emsp;|-> index.js<br>
|&emsp;&emsp; |-> models.js<br>
|&emsp;----node_modules<br>
|&emsp;&emsp; |---(dependency_files)<br>
|&emsp;----.gitignore<br>
|&emsp;----index.js<br>
|&emsp;----package-lock.json<br>
|&emsp;----package.json<br>
|&emsp;----README.md<br>
|&emsp;&emsp;----service_worker.js<br>
|&emsp;----service.js<br>

`npm start`

vishnu@vishnu-ubuntu-X510UQR:~/Desktop/assignment/Mean-App-Backend\$ npm start<br>

Mean-App-Backend@1.0.0 start /home/vishnu/Desktop/assignment/Mean-App-Backend<br>
 nodemon index.js<br>
 [nodemon] 2.0.4<br>
 [nodemon] to restart at any time, enter `rs` > [nodemon] watching path(s): _._ > [nodemon] watching extensions: js,mjs,json<br>
 [nodemon] starting `node index.js`<br>
 DB initialized - connected to: mongodb://localhost:27017<br>
 Sun Jul 19 2020 23:31:53 GMT+0530 (India Standard Time)<br>
 Starting development server at http://127.0.0.1:3000<br>
 Quit the server with CONTROL-C. <br>

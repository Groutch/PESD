const express = require('express');
const app = express();

const bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({ extended: false }))

app.set('view engine','ejs');

app.use('/',express.static('/public'));

app.get('/' , (req,res) =>{
	res.render('index');
});

app.get('/signup',(req,res)=>{
	res.render('signup');
});



const PORT = process.env.PORT || 8080; 

app.listen(PORT , (req,res) => {
	console.log('Connected');
});
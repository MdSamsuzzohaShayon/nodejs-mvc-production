const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');
const mongoose = require('mongoose');



// CHECK IF WE DON'T RUN IN PRODUCTION THEN WE WILL PULL ALL VARIABLE FROM .ENV FILE THAT WE MADE
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}


app.set('view engine', "ejs");
app.set('views', __dirname+'/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));



// Setup mongodb for production
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
const db  = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', ()=> console.log("connected to db"));



app.use('/', indexRouter);

app.listen(process.env.PORT || 3000, ()=>console.log("server is running successfully"));

const express = require("express");
const app = express();
const hbs = require('express-handlebars').engine;
const session = require('express-session');
const flash = require('express-flash');
require('dotenv').config({path: './config/.env'});
const port = process.env.PORT;

const customHelpers = require('./utils/customHelpers');
app.engine('hbs', hbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    ...customHelpers.helpers
}
}))
app.set('view engine', 'hbs')
app.set('views', './views');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
  secret: 'mysecretkey', 
  resave: false,        
  saveUninitialized: false,
  cookie: {
      secure: false,
  }
}));
app.use(flash());

//connect dtb
const db = require('./config/db');
db.connect();

app.use("/", require("./routes/main"));

app.use("/admin", require("./routes/admin"));

app.use("/user", require("./routes/user"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

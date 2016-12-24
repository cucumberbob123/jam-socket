var express = require('express');

var app = express();

var server = app.listen(80, listening);

function listening() {
  console.log("listening... ");

}




app.use(express.static('website'));

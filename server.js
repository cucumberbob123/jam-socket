var express = require('express');

var app = express();
var port = process.env.PORT || 8080;
var server = app.listen(port, listening);

function listening() {
  console.log("listening... ");

}




app.use(express.static('website'));

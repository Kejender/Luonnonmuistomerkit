var express = require('express');
var app = express();
var cors = require('cors');
app.use(express.static(__dirname + '/public'));
var port = 8000;
app.listen(port);
console.log('server on localhost:' + port);
/*
app.get('/public', function (req, res) {
  res.send('Hello World!')
})*/

/*app.get('http://opendata.navici.com/tampere/opendata/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=opendata:WFS_RULLALAUTAILUALUE_MVIEW&outputFormat=json', (req, res, next) => {
  res.send("hello");
  //console.log("ladaa");
  //console.log(res);
})*/



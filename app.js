// web.js
var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  res.send('<h1>Njod JS - Graat Suksess!</h1><br><br><img src="http://www.ventrian.com/Portals/0/images/News-Articles/WLW/AnalyzingDotNetNukePerformancewiththeSQL_A767/Borat_Great_Success-260x300_2.jpg">');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});

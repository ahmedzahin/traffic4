var Sequelize = require('sequelize'),
    epilogue = require('epilogue'),
    http = require('http');

// Define your models
var database = new Sequelize('sql6150357', 'sql6150357', 'eJzAs7AFUH', {
  host: 'sql6.freemysqlhosting.net',
  dialect: 'mysql',
  define: {
        timestamps: false
    }
});

// Initialize server
var server, app;

  var express = require('express'),
      bodyParser = require('body-parser');

  var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  server = http.createServer(app);

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// Initialize epilogue
epilogue.initialize({
  app: app,
  sequelize: database
});

var normalizedPath = require("path").join(__dirname, "/models");

require("fs").readdirSync(normalizedPath).forEach(function(file) {

  var name = require("path").basename(file, ".js");

  if(file !== "index.js" ){
    epilogue.resource({
      model: database.import(normalizedPath +"/"+ file),
      endpoints: ["/api/"+name, "/api/"+name+"/:"+name+"_id"]
    });
  }
});


// Create database and listen
database
  .sync()
  .then(function() {
    server.listen(function() {
      var host = process.env.HOST || '127.0.0.1',
          port = process.env.PORT || 3001;

      console.log('listening at http://%s:%s', host, port);
    });
  });

  app.listen(3001, function () {
    console.log("express has started on port 3001");
    });

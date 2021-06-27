var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');


models = require('express-cassandra');
models.setDirectory(__dirname + '/models').bind(
  {
    clientOptions: {
      contactPoints: ['127.0.0.1'],
      localDataCenter: 'dc1',
      protocolOptions: { port: 9042 },
      keyspace: 'demo',
      queryOptions: { consistency: models.consistencies.one },
      elasticsearch: {
        host: 'http://localhost:9200',
        apiVersion: '5.6',
        sniffOnStart: true
      },
      gremlin: {
        host: '127.0.0.1',
        port: 8182,
        storage: {
          backend: 'cassandrathrift',
          hostname: '127.0.0.1',
          port: 9160,
        },
        index: {
          search: {
            backend: 'elasticsearch',
            hostname: '127.0.0.1',
            port: 9200,
          },
        }
      },
    },
    ormOptions: {
      // omitted other options for clarity
      defaultReplicationStrategy: {
        class: 'NetworkTopologyStrategy',
        dc1: 1
      },
      migration: 'alter',
      manageESIndex: true,
      manageGraphs: true
    }
  },
  function (err) {
    if (err) throw err;
  }
);

//load customers route
var customers = require('./routes/index');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', customers.list);
app.post('/search', customers.search);
app.post('/graph', customers.graph);
app.get('/add', customers.add);
app.post('/add', customers.save);
app.get('/delete/:email', customers.delete_customer);
app.get('/edit/:email', customers.edit);
app.post('/edit/:email', customers.save);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

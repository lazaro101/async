const express = require('express');

const app = express();
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const ServeStatic = require('serve-static');

require('dotenv').config();

global.__basedir = __dirname;
const Configs = require('./config');
const { start: startDb } = require('./db/mongoose');

// console.log(process.env.DB_DSN)
// startDb(Configs.db_host + Configs.db_name);
startDb();


var protocol = require('http');
var server = protocol.createServer(app);

app.set('views', Configs.view_path);
app.set('view engine', Configs.view_engine);
app.set("view options", Configs.view_options);
app.set('view cache', Configs.view_cache);

app.use(ServeStatic(Configs.static_path));

app.use(helmet()); // security :: setting various HTTP headers
app.use(express.json({ limit: '50mb', extended: true })); // Used to parse JSON bodies
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Parse URL-encoded bodies
app.use(cors());
app.use(morgan('dev'));

app.use(require('./routes'));

server.listen(Configs.port, () => {
  	console.log(`Server started on port ${Configs.port}.`);
});

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import index from './router/index.controller';
import iam from './router/iam.controller';


export const app = express();

app.use(bodyParser.json());

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'));


app.use('/', index);
app.use('/api/iam/v1', iam);

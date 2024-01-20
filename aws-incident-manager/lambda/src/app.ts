import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Helmet from 'helmet'

export const app = express();


const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: "*" ,
  preflightContinue: false,
};

app.use(cors(options));
app.use(Helmet());

app.use(bodyParser.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).send({status: 'ok'});
});

app.all("*", (req: Request, res: Response) => {
  res.status(404).send("Not Found");
})
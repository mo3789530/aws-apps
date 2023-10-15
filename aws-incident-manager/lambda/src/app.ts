import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

export const app = express();

app.use(bodyParser.json());

type Person = {
  name: string;
  age: number;
};

const users: { [id: string]: Person } = {
  sazae: {
    name: 'フグ田サザエ',
    age: 24,
  },
  hamihei: {
    name: '磯野海平',
    age: 54,
  },
  fune: {
    name: '磯野フネ',
    age: 50,
  },
  masuo: {
    name: 'フグ田マスオ',
    age: 28,
  },
  katsuo: {
    name: '磯野カツオ',
    age: 11,
  },
  wakame: {
    name: '磯野ワカメ',
    age: 9,
  },
  tarao: {
    name: 'フグ田タラオ',
    age: 3,
  },
};

app.get('/echo', (req: Request, res: Response) => {
  const message = req.query['message'];

  res.send(`Hello ${message}!!`);
});

app.post('/echo', (req: Request, res: Response) => {
  const message = req.body['message'];

  res.send({ message: `Hello ${message}!!` });
});

app.get('/users', (req: Request, res: Response) => {
  res.send(Object.values(users));
});

app.get('/users/:id', (req: Request, res: Response) => {
  const id = req.params['id'];
  res.send(users[id]);
});
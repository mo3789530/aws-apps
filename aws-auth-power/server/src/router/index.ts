import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello' });
})


router.get('/api/health', (req, res) => {
  res.json({ message: 'Healthy' });
})


export default router;

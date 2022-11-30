
import express, { Request, Response } from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', (req: Request, res: Response, next: Function) => {
  res.json({ response: 'home' });
});

module.exports = router;
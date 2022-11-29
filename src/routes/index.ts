import express, { Request, Response } from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: Function) {
  res.render("index", { title: "Expresso" });
});

module.exports = router;

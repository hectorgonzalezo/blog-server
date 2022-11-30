import { Response, Request } from "express";
import { IPost } from "../types/post";
import Post from "../models/postModel";

exports.get_all_posts = (req: Request, res: Response) => {
  res.json({ response: "get all posts" });
};

exports.get_post = (req: Request, res: Response) => {
  res.json({ response: 'read post' + req.params.id });
};
exports.create_post = (req: Request, res: Response) => {
  res.json({ response: 'create post' + req.params.id  });
};
exports.update_post = (req: Request, res: Response) => {
  res.json({ response: 'update post' + req.params.id  });
};
exports.delete_post = (req: Request, res: Response) => {
  res.json({ response: 'delete post' + req.params.id  });
};

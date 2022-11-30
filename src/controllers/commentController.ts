import { Response, Request } from "express";
import { ExtendedRequest } from  '../types/extendedRequest';
import { IComment } from "../types/comment";
import Comment from "../models/commentModel";

exports.get_all_comments = (req: ExtendedRequest, res: Response) => {
  res.json({ response: `All comments in post ${req.messageId}` });
};

exports.get_comment = (req: Request, res: Response) => {
  res.json({ response: 'read comment' + req.params.commentId });
};
exports.create_comment = (req: Request, res: Response) => {
  res.json({ response: 'create comment' + req.params.commentId  });
};
exports.update_comment = (req: Request, res: Response) => {
  res.json({ response: 'update comment' + req.params.commentId  });
};
exports.delete_comment = (req: Request, res: Response) => {
  res.json({ response: 'delete comment' + req.params.commentId  });
};

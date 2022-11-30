import { Response, Request } from "express";
import { IUser } from "../types/user";
import User from "../models/userModel";

exports.get_all_users = (req: Request, res: Response) => {
  res.json({ response: 'All users' });
};

exports.get_user = (req: Request, res: Response) => {
  res.json({ response: 'read user' + req.params.userId });
};
exports.create_user = (req: Request, res: Response) => {
  res.json({ response: 'create user' + req.params.userId  });
};
exports.update_user = (req: Request, res: Response) => {
  res.json({ response: 'update user' + req.params.userId  });
};
exports.delete_user = (req: Request, res: Response) => {
  res.json({ response: 'delete user' + req.params.userId  });
};
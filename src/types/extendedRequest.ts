import { Request } from 'express';

export interface ExtendedRequest extends Request {
  messageId?: string;
}

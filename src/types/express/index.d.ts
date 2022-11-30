export {};

declare global {
  namespace Express {
    interface Request {
      messageId?: string;
    }
  }
}

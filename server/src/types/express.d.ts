export { };

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        userEmail: string;
        tenantId: string;
      };
    }
  }
}
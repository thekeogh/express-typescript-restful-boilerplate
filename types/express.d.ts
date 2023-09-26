export {};

declare global {
  namespace Express {
    /**
     * JWT Payload Definition for Bearer Authorization
     *
     * @remarks
     * Customise your JWT payload by extending this interface. When using Bearer authorization headers, the req.auth
     * (or req.user, depending on your setup) will conform to this interface.
     *
     * @see {@link https://github.com/auth0/express-jwt express-jwt}
     */
    interface User {
      name: string;
      email: string;
      sub: string;
      iat: number;
      exp: number;
      aud: string | string[];
      iss: string;
    }
    interface Request {
      auth: User;
      user: User;
    }
  }
}

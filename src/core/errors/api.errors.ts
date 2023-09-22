/**
 * Represents an HTTP error that can be thrown within the service.
 *
 * Instances of this class can be thrown anywhere within the service. Express is configured to handle these error
 * instances and return the appropriate response to the consumer.
 */
export class Exception<N = 500> extends Error {
  public status: N;

  constructor(status: N, message: string, error?: Error, name?: string) {
    super(message);
    this.status = status;
    this.name = name || "Error";
    if (error instanceof Error) {
      this.stack = error.stack;
      this.cause = error.cause;
    }
  }
}

/**
 * Collection of predefined HTTP errors for easy application.
 *
 * @param message - Custom message for the error thrown.
 * @param error - The raw error (if applicable).
 * @param name - Name of the error.
 *
 * @example
 * throw conflict("My custom conflict message");
 * return next(conflict());
 */
export const movedPermanently = (message = "Moved Permanently", error?: Error, name = "MovedPermanently") =>
  new Exception<301>(301, message, error, name);
export const temporaryRedirect = (message = "Temporary Redirect", error?: Error, name = "TemporaryRedirect") =>
  new Exception<307>(307, message, error, name);
export const permanentRedirect = (message = "Permanent Redirect", error?: Error, name = "PermanentRedirect") =>
  new Exception<308>(308, message, error, name);
export const badRequest = (message = "Bad Request", error?: Error, name = "BadRequest") => new Exception<400>(400, message, error, name);
export const unauthorized = (message = "Unauthorized", error?: Error, name = "Unauthorized") => new Exception<401>(401, message, error, name);
export const paymentRequired = (message = "Payment Required", error?: Error, name = "PaymentRequired") =>
  new Exception<402>(402, message, error, name);
export const forbidden = (message = "Forbidden", error?: Error, name = "Forbidden") => new Exception<403>(403, message, error, name);
export const notFound = (message = "Not Found", error?: Error, name = "NotFound") => new Exception<404>(404, message, error, name);
export const methodNotAllowed = (message = "Method Not Allowed", error?: Error, name = "MethodNotAllowed") =>
  new Exception<405>(405, message, error, name);
export const notAcceptable = (message = "Not Acceptable", error?: Error, name = "NotAcceptable") => new Exception<406>(406, message, error, name);
export const requestTimeout = (message = "Request Timeout", error?: Error, name = "RequestTimeout") => new Exception<408>(408, message, error, name);
export const conflict = (message = "Conflict", error?: Error, name = "Conflict") => new Exception<409>(409, message, error, name);
export const gone = (message = "Gone", error?: Error, name = "Gone") => new Exception<410>(410, message, error, name);
export const lengthRequired = (message = "Length Required", error?: Error, name = "LengthRequired") => new Exception<411>(411, message, error, name);
export const preconditionFailed = (message = "Precondition Failed", error?: Error, name = "PreconditionFailed") =>
  new Exception<412>(412, message, error, name);
export const payloadTooLarge = (message = "Payload Too Large", error?: Error, name = "PayloadTooLarge") =>
  new Exception<413>(413, message, error, name);
export const uriTooLong = (message = "URI Too Long", error?: Error, name = "UriTooLong") => new Exception<414>(414, message, error, name);
export const imATeapot = (message = "I'm a Teapot", error?: Error, name = "ImATeapot") => new Exception<418>(418, message, error, name);
export const unprocessableEntity = (message = "Unprocessable Entity", error?: Error, name = "UnprocessableEntity") =>
  new Exception<422>(422, message, error, name);
export const tooManyRequests = (message = "Too Many Requests", error?: Error, name = "TooManyRequests") =>
  new Exception<429>(429, message, error, name);
export const internalServerError = (message = "Oops! Something went wrong.", error?: Error, name = "InternalServerError") =>
  new Exception<500>(500, message, error, name);
export const notImplemented = (message = "Not Implemented", error?: Error, name = "NotImplemented") => new Exception<501>(501, message, error, name);
export const badGateway = (message = "Bad Gateway", error?: Error, name = "BadGateway") => new Exception<502>(502, message, error, name);
export const serviceUnavailable = (message = "Service Unavailable", error?: Error, name = "ServiceUnavailable") =>
  new Exception<503>(503, message, error, name);
export const gatewayTimeout = (message = "Gateway Timeout", error?: Error, name = "GatewayTimeout") => new Exception<504>(504, message, error, name);
export const bandwidthLimitExceeded = (message = "Bandwidth Limit Exceeded", error?: Error, name = "BandwidthLimitExceeded") =>
  new Exception<509>(509, message, error, name);

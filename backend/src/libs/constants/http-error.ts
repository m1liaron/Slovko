import { StatusCodes } from "http-status-codes";

class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }

  static notFound(message = "Not found") {
    return new HttpError(StatusCodes.NOT_FOUND, message);
  }

  static unauthorized(message = "Unauthorized") {
    return new HttpError(StatusCodes.UNAUTHORIZED, message);
  }

  static forbidden(message = "Forbidden") {
    return new HttpError(StatusCodes.FORBIDDEN, message);
  }

  static badRequest(message = "Bad request") {
    return new HttpError(StatusCodes.BAD_REQUEST, message);
  }

  static conflict(message = "Conflict") {
    return new HttpError(StatusCodes.CONFLICT, message);
  }
}

export { HttpError };

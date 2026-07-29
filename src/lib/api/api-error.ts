export class ApiError extends Error {
  status: number;
  code: string;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    code = "UNKNOWN_ERROR",
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isValidationError(): boolean {
    return this.status === 422 || this.status === 400;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }

  static fromResponse(
    status: number,
    data?: {
      message?: string | string[];
      error?: string;
      statusCode?: number;
      code?: string;
      details?: Record<string, unknown>;
    },
  ): ApiError {
    let message = `Request failed with status ${status}`;

    if (data?.message) {
      message = Array.isArray(data.message)
        ? data.message.join("; ")
        : data.message;
    } else if (data?.error) {
      message = data.error;
    }

    return new ApiError(message, status, data?.code, data?.details);
  }
}

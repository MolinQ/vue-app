export class HttpError extends Error {
  status: number;
  isNetworkError: boolean;

  constructor(message: string, status = 0, isNetworkError = false) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.isNetworkError = isNetworkError;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    if (error.isNetworkError || !navigator.onLine) {
      return "Network error. Check your internet connection and try again.";
    }

    if (error.status === 404) {
      return "The requested resource was not found.";
    }

    if (error.status === 401 || error.status === 403) {
      return "Access denied. Please try again later.";
    }

    if (error.status >= 500) {
      return "Server error. Please try again later.";
    }

    return error.message || "Something went wrong. Please try again.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

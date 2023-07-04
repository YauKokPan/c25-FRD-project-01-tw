class APIError extends Error {
  constructor(public httpStatus: number, message?: string) {
    super(message ?? "error message");

    // Object.setPrototypeOf(this, APIError.prototype);
  }
}

const err1 = new APIError(400, "error");
console.log(err1 instanceof APIError);
console.log(err1 instanceof Error);

const err2 = new Error("error");
console.log(err2 instanceof APIError);
console.log(err2 instanceof Error);

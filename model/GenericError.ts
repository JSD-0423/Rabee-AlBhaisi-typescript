class GenericError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.message = message;
    this.status = status;
    this.name = "GenericError";
  }
}

export default GenericError;

export class AppError extends Error {
  status: number;
  code: string;
  details?: Record<string, unknown>;
  constructor(code: string, message: string, status = 400, details?: Record<string, unknown>) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const errorResponse = (err: unknown) => {
  if (err instanceof AppError) {
    return new Response(JSON.stringify({ errorCode: err.code, message: err.message, details: err.details }), {
      status: err.status,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  console.error(err);
  return new Response(JSON.stringify({ errorCode: 'INTERNAL_ERROR', message: '伺服器錯誤' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  });
};

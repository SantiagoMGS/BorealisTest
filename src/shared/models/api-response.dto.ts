export class ApiResponse<T> {
  status: 'success' | 'error';
  statusCode: number;
  message: string;
  data?: T;
  path?: string;
  timestamp: string;

  constructor(
    status: 'success' | 'error',
    statusCode: number = 200,
    message: string,
    data?: T,
    path?: string,
  ) {
    this.status = status;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.path = path;
    this.timestamp = new Date().toISOString();
  }
}

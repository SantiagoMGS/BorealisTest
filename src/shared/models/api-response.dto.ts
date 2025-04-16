export class ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  path?: string;
  timestamp: string;

  constructor(status: 'success' | 'error', message: string, data?: T, path?: string) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.path = path;
    this.timestamp = new Date().toISOString();
  }
}

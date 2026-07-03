import { HttpError } from "@/types/http";

export class HttpService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }

  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_API_ACCES_KEY}`,
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorMsg = await response.text();
      throw new HttpError(
        errorMsg || `Request failed (${response.status})`,
        response.status,
      );
    }

    return response.json() as Promise<T>;
  }

  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      throw new HttpError(
        error instanceof Error ? error.message : "Network request failed",
        0,
        true,
      );
    }
  }

  public async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
      headers: this.getHeaders(),
    });
  }

  public async post<T, U>(endpoint: string, body: U): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
  }
}

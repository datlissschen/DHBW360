import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {firstValueFrom, Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://vsv-research.volkmann-webservices.de/auth';

  constructor(private http: HttpClient) {}

  async getUsername(accessToken: string): Promise<string | undefined> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ user?: string }>(`${this.apiUrl}/verify?token=${accessToken}`)
      );
      return response?.user;
    } catch (error) {
      console.error('Error verifying token:', error);
      return undefined;
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials);
  }
}

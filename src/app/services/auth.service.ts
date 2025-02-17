import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User, LoginCredentials } from '../models/user.model';
import { LoggerService } from './logger.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private readonly VALID_CREDENTIALS = {
    email: 'neabyop@gmail.com',
    password: 'Hol@12345'
  };

  constructor(
    private logger: LoggerService,
    private toast: ToastService
  ) {}

  login(credentials: LoginCredentials): Observable<User> {
    if (
      credentials.email === this.VALID_CREDENTIALS.email &&
      credentials.password === this.VALID_CREDENTIALS.password
    ) {
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        name: 'Usuario Musical'
      };
      
      this.currentUserSubject.next(mockUser);
      this.logger.log('Usuario ha iniciado sesión:', mockUser);
      this.toast.success('¡Bienvenido a NeavyFy!');
      return of(mockUser);
    }

    this.toast.error('Credenciales inválidas');
    return throwError(() => new Error('Credenciales inválidas'));
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.logger.log('Usuario ha cerrado sesión');
    this.toast.success('Has cerrado sesión correctamente');
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
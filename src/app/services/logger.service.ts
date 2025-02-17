import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  log(message: string, ...args: any[]) {
    if (!environment.production) {
      console.log(message, ...args);
    }
    // Add external logging service integration here if needed
  }

  error(message: string, ...args: any[]) {
    console.error(message, ...args);
    // Add external logging service integration here if needed
  }

  warn(message: string, ...args: any[]) {
    if (!environment.production) {
      console.warn(message, ...args);
    }
    // Add external logging service integration here if needed
  }
}
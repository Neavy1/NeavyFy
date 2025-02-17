import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="contact-container">
      <h1>Contact Us</h1>
      <div class="form-container">
        <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Name</mat-label>
            <input matInput formControlName="name" placeholder="Your name">
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" placeholder="Your email" type="email">
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Message</mat-label>
            <textarea matInput formControlName="message" placeholder="Your message" rows="4"></textarea>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="!contactForm.valid">
            Send Message
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .contact-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    .form-container {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333;
      margin-bottom: 2rem;
    }
    .form-field {
      width: 100%;
      margin-bottom: 1rem;
    }
    form {
      display: flex;
      flex-direction: column;
    }
    button {
      align-self: flex-start;
    }
  `]
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private logger: LoggerService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
    this.logger.log('Contact component initialized');
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.logger.log('Form submitted:', this.contactForm.value);
      // Add form submission logic here
    }
  }
}
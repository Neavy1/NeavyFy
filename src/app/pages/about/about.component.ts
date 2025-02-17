import { Component } from '@angular/core';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="about-container">
      <h1>About Us</h1>
      <div class="content">
        <p>We are a dedicated team committed to delivering high-quality solutions to our customers.</p>
        <p>Our mission is to create innovative and user-friendly applications that make a difference.</p>
      </div>
    </div>
  `,
  styles: [`
    .about-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    .content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333;
      margin-bottom: 2rem;
    }
    p {
      margin-bottom: 1rem;
      line-height: 1.6;
    }
  `]
})
export class AboutComponent {
  constructor(private logger: LoggerService) {
    this.logger.log('About component initialized');
  }
}
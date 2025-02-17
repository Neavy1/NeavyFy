import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent],
  template: `
    <app-hero></app-hero>
    <section class="content">
      <h2>Featured Content</h2>
      <p>Welcome to our platform. Discover all the amazing features we offer.</p>
    </section>
  `,
  styles: [`
    .content {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
  `]
})
export class HomeComponent {
  constructor(private logger: LoggerService) {
    this.logger.log('Home component initialized');
  }
}
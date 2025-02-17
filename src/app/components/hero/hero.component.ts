import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  template: `
    <section class="hero">
      <div class="hero-content">
        <h1>La música que amas,<br>cuando quieras</h1>
        <p>Millones de canciones esperan por ti. Sin anuncios.</p>
        <button mat-raised-button color="primary" routerLink="/login" class="cta-button">
          COMIENZA AHORA
        </button>
      </div>
      <div class="hero-background"></div>
    </section>
  `,
  styles: [`
    .hero {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      background: linear-gradient(to right bottom, #1DB954, #191414);
    }
    .hero-content {
      max-width: 800px;
      padding: 0 20px;
      text-align: center;
      color: white;
      position: relative;
      z-index: 2;
    }
    h1 {
      font-size: 4rem;
      font-weight: 900;
      margin-bottom: 1.5rem;
      line-height: 1.2;
    }
    p {
      font-size: 1.5rem;
      margin-bottom: 2.5rem;
      opacity: 0.9;
    }
    .cta-button {
      font-size: 1.2rem;
      padding: 0.8rem 3rem;
      border-radius: 500px;
      background-color: #1DB954;
      color: white;
      font-weight: bold;
      letter-spacing: 1px;
    }
    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.5) 100%);
    }
  `]
})
export class HeroComponent {}
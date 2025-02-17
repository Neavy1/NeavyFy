import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-links">
          <a href="#">Legal</a>
          <a href="#">Centro de privacidad</a>
          <a href="#">Política de privacidad</a>
          <a href="#">Cookies</a>
          <a href="#">Sobre los anuncios</a>
        </div>
        <div class="footer-copyright">
          <p>&copy; 2025 Tu Música. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--spotify-black);
      padding: 40px 0;
      margin-top: auto;
      border-top: 1px solid var(--spotify-dark-gray);
    }
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .footer-links {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 20px;
    }
    .footer-links a {
      color: var(--spotify-light-gray);
      text-decoration: none;
      font-size: 0.875rem;
    }
    .footer-links a:hover {
      color: var(--spotify-green);
    }
    .footer-copyright {
      text-align: center;
      color: var(--spotify-light-gray);
      font-size: 0.75rem;
    }
  `]
})
export class FooterComponent {}
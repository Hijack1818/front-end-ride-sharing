import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <nav style="background: #333; padding: 10px; color: white; display: flex; gap: 20px;">
      <a routerLink="/user" routerLinkActive="active" style="color: white; text-decoration: none;">Rider App</a>
      <a routerLink="/driver" routerLinkActive="active" style="color: white; text-decoration: none;">Driver App</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'front-end-ride-sharing';
}

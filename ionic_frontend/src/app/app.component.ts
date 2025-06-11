import { HttpClient, HttpHandler, provideHttpClient, withFetch } from '@angular/common/http';
import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, provideIonicAngular } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
  standalone: true,
})
export class AppComponent {
  constructor() {}
}

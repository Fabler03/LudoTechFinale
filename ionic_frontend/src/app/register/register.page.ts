import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonButton, IonCardContent, IonCardTitle, IonItem, IonLabel, IonInput } from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonCardTitle, IonCardContent, IonButton, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonLabel, IonInput, RouterLink]
})

export class RegisterPage implements OnInit {

  username: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) { }

  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

  register() {
    // chiamiamo AuthService passando email, username e password
    this.authService.register(this.username, this.email, this.password).subscribe({
      next: (response: any) => {
        console.log('Registrazione riuscita', response);
        this.presentToast('Registrazione riuscita', 'success');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        const errorMsg = error.error?.message || 'Errore sconosciuto';
        console.error('Errore nella registrazione:', error);
        this.presentToast(`Registrazione fallita: ${errorMsg}`, 'danger');
      }
    })
  }
  ngOnInit() {
  }

}

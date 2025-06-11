import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, ToastController } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonButtons, IonInput, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [IonInput, IonButtons, IonButton, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonGrid, IonRow, IonCol]
})

export class UserPage implements OnInit {
  id = 0;
  username: string = 'defaultUser';
  email: string = 'default@example.com';
  role: string = 'user';
  avatar: string = 'panda.png'; // Default avatar

  editMode: boolean = false;

  availableAvatars: string[] = ['panda.png', 'chicken.png', 'koala.png', 'meerkat.png', 'sea-lion.png', 'sloth.png', 'bear.png'];

  constructor(private authService: AuthService, private alertController: AlertController, private toastController: ToastController) { }

  async presentToast(message: string, color: string = 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      position: 'top',
      color: color,
    });
    toast.present();
  }

  toggleEdit() {
    if (this.editMode) {
      this.saveProfile();
      this.editMode = false;
    } else {
      this.editMode = true;
    }
  }

  saveProfile() {
    this.authService.updateUserInfo(this.id, this.username, this.email, this.avatar).subscribe({
      next: (response) => {
        console.log('Profilo aggiornato:', response);
        this.presentToast('Profilo aggiornato con successo.', 'success');
      },
      error: (error) => {
        const errorMsg = error.error?.message || 'Errore sconosciuto';
        console.error('Errore durante l\'aggiornamento del profilo:', error);
        this.presentToast('Errore durante l\'aggiornamento del profilo: ' + errorMsg, 'danger');
        this.loadUser();
      }
    });
  }

  selectAvatar(selected: string) {
    this.avatar = selected;
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Conferma Logout',
      message: 'Sei sicuro di voler uscire?',
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel'
        },
        {
          text: 'Logout',
          handler: () => {
            this.authService.logout('Logout effettuato con successo.');
          }
        }
      ]
    });
    await alert.present();
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loadUser();
  }

  
  loadUser() {
    const userInfo = this.authService.getUserInfo();
    if (!userInfo) {
      this.authService.logout("Sessione scaduta, effettua il login");
      return;
    }
    this.id = userInfo.id;
    this.username = userInfo.username;
    this.email = userInfo.email;
    this.role = userInfo.role;
    this.avatar = userInfo.avatar;
    console.log('User loaded:', this.id, this.username, this.email, this.role, this.avatar);
  }
}


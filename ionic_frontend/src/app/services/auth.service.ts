import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';

type UserRole = 'user' | 'admin';

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // URL del tuo server Node.js
  private currentUser: UserInfo | null = null;

  constructor(private http: HttpClient, private toast: ToastController, private router: Router) {}

  async presentToast(message: string, color: string = 'warning') {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

  login(username: string, password: string): Observable<any> {
    const credentials = { username, password };
    return this.http.post(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap(() => this.fetchUserInfo().subscribe()) // aggiorna currentUser dopo il login
    );
  }

  register(username: string, email: string, password:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });  // inutile passare il role, definibile solo con post a backend
  }

  fetchUserInfo(): Observable<UserInfo | null> {
    return this.http.get<UserInfo>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      tap(user => this.currentUser = user),
      catchError(err => {
        this.currentUser = null;
        return of(null);
      })
    );
  }

  getUserInfo(): UserInfo | null {
    return this.currentUser
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`, { withCredentials: true }).pipe(
      catchError(err => {
        console.error('Errore nel recupero dell\'utente:', err);
        return of(null);
      })
    );
  }

  updateUserInfo(id: number, username: string, email: string, avatar: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/me`, { id, username, email, avatar }, { withCredentials: true }).pipe(
      tap(() => this.fetchUserInfo().subscribe()) // aggiorna currentUser dopo l'update
    );
  }

  async logout(message: string = 'sei stato disconnesso', redirect: boolean = true) {
    this.currentUser = null;
    await this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).toPromise();
    console.log('Logout effettuato');
    await this.presentToast(message, 'success');
    if (redirect) {
      this.router.navigate(['/login']); // Redirect to login page
    }
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  hasRole(requiredRole: string): boolean {
    return this.currentUser?.role === requiredRole;
  }
  
}

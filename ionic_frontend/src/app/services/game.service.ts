import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Game {
  id: number;
  name: string;
  description: string;
  author: string;
  approvedby?: string;
  html: string;
  css: string;
  js: string;
  icon: string;
  createdAt: string;
}

export interface Score {
  id: number;
  gamename: string;
  username: string;
  avatar: string;
  score: number;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})

export class GameService {
  private apiUrl = 'http://localhost:3000/api/games'; 

  constructor(private http: HttpClient, private authService: AuthService) {}

  getApprovedGames(): Observable<{ games: Game[] }> {
    return this.http.get<{ games: Game[] }>(this.apiUrl, { withCredentials: true });
  }

  getUnapprovedGames(): Observable<{ games: Game[] }> {
    // il backend farà il controllo se l'utente è amministratore o meno
    return this.http.get<{ games: Game[] }>(`${this.apiUrl}/unapproved`, { withCredentials: true });
  }

  approveGame(id: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/approve/${id}`, {}, { withCredentials: true });
  }

  uploadScore(gameId: number, score: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/uploadScore`, { gameId, score }, { withCredentials: true });
  }

  listScores(gameId: number): Observable<{ scores: Score[] }> {
    return this.http.get<{ scores: Score[] }>(`${this.apiUrl}/scores/${gameId}`, { withCredentials: true });
  }

  downloadGameFiles(id: string | number ): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${id}`, { responseType: 'blob', withCredentials: true });
  }

  getGameById(id: string | number): Observable<{ game: Game }> {
    return this.http.get<{ game: Game }>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  deleteGame(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  createGame(game: FormData): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/upload`, game, { withCredentials: true });
  }
}

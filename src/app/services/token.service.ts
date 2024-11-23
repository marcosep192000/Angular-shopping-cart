import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

const TOKEN_KEY = 'token';
const USERNAME_KEY = 'username';
const AUTHORITIES_KEY = 'authorities';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  loggedIn = new BehaviorSubject<Boolean>(false);
  roles: string[] = [];
  private helper: JwtHelperService | null = null; // Manejo seguro para SSR

  constructor(private router: Router) {
    if (this.isBrowser()) {
      this.helper = new JwtHelperService();
      this.checkToken();
    }
  }

  // Verificación de que estamos en un entorno de navegador antes de acceder a localStorage
  private isBrowser(): boolean {
    const isBrowser =
      typeof window !== 'undefined' && window.localStorage !== undefined;
    console.log('isBrowser:', isBrowser); // Log para depuración
    return isBrowser;
  }

  // Decodifica el token y devuelve su payload
  private decodeToken(): any {
    if (this.isBrowser() && this.helper) {
      const token = localStorage.getItem(TOKEN_KEY);
      return token ? this.helper.decodeToken(token) : null;
    }
    return null;
  }

  // Inicializa datos del token (username, roles)
  public initializeTokenData(): void {
    if (this.isBrowser()) {
      const decodedToken = this.decodeToken();
      if (decodedToken) {
        const username = decodedToken['username'] || decodedToken['sub'];
        const authorities =
          decodedToken['authorities'] || decodedToken['roles'] || [];
        this.setUserName(username);
        this.setAuthorities(authorities);
      }
    }
  }

  public setToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.setItem(TOKEN_KEY, token);
      this.initializeTokenData();
    }
  }

  public getToken(): string {
    if (this.isBrowser()) {
      return localStorage.getItem(TOKEN_KEY) || '';
    }
    return '';
  }

  public setUserName(username: string): void {
    if (this.isBrowser()) {
      localStorage.removeItem(USERNAME_KEY);
      localStorage.setItem(USERNAME_KEY, username);
    }
  }

  public getUserName(): string {
    if (this.isBrowser()) {
      return localStorage.getItem(USERNAME_KEY) || '';
    }
    return '';
  }

  public setAuthorities(authorities: string[]): void {
    if (this.isBrowser()) {
      localStorage.removeItem(AUTHORITIES_KEY);
      localStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
    }
  }

  public getAuthorities(): string[] {
    if (this.isBrowser()) {
      const roles = localStorage.getItem(AUTHORITIES_KEY);
      return roles ? JSON.parse(roles) : [];
    }
    return [];
  }

  public logOut(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USERNAME_KEY);
      localStorage.removeItem(AUTHORITIES_KEY);
      this.loggedIn.next(false);
      this.router.navigateByUrl('/login');
    }
  }

  private checkToken(): void {
    if (this.isBrowser() && this.helper) {
      const token = this.getToken();
      const isExpired = this.helper.isTokenExpired(token);
      if (isExpired) {
        this.logOut();
      } else {
        this.loggedIn.next(true);
      }
    }
  }

  get isLogged(): Observable<Boolean> {
    return this.loggedIn.asObservable();
  }
}
``;

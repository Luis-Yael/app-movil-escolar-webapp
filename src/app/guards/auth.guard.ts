import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FacadeService } from '../services/facade.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private facadeService: FacadeService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const token = this.facadeService.getSessionToken();
    if (token && token !== '') {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}

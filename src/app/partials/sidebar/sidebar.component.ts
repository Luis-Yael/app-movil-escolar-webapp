import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    standalone: false
})
export class SidebarComponent implements OnInit {
  mobileOpen = false;
  isMobileView = false;

  constructor(
    private router: Router,
    private facadeService: FacadeService
  ) { }

  ngOnInit(): void {
    this.isMobileView = window.innerWidth < 900;
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobileView = window.innerWidth < 900;
    if (!this.isMobileView) {
      this.mobileOpen = false;
    }
  }

  toggleSidebar() {
    this.mobileOpen = !this.mobileOpen;
  }

  closeSidebar() {
    this.mobileOpen = false;
  }

  logout() {
    this.facadeService.logout().subscribe(
      (response) => {
        this.facadeService.destroyUser();
        this.router.navigate(['/login']);
        this.closeSidebar();
      },
      (error) => {
        // Fallback: clear local data and navigate anyway
        this.facadeService.destroyUser();
        this.router.navigate(['/login']);
        this.closeSidebar();
      }
    );
  }

  // Helper methods — delegados a FacadeService (fuente única de verdad)
  isAdmin(): boolean { return this.facadeService.isAdmin(); }
  isTeacher(): boolean { return this.facadeService.isTeacher(); }
  isStudent(): boolean { return this.facadeService.isStudent(); }
  canSeeAdminItems(): boolean { return this.facadeService.canSeeAdminItems(); }
  canSeeTeacherItems(): boolean { return this.facadeService.canSeeTeacherItems(); }
  canSeeStudentItems(): boolean { return this.facadeService.canSeeStudentItems(); }
  canSeeHomeItem(): boolean { return this.facadeService.canSeeHomeItem(); }
  canSeeRegisterItem(): boolean { return this.facadeService.canSeeRegisterItem(); }
}

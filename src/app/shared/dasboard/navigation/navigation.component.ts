import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DashboardComponent } from "../dashboard/dashboard.component";
import { VerticalMenuComponent } from "../vertical-menu/vertical-menu.component";
import { TokenService } from '../../../services/token.service';


@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.css',
    standalone: true,
    imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    DashboardComponent,
    VerticalMenuComponent,
  
]
})
export class NavigationComponent  implements OnInit {
logout() {
 
    this.tokenService.logOut();
  
}
 
  constructor(   private tokenService: TokenService) { }
  ngOnInit(): void {
this.username = this.tokenService.getUserName();
this.roles = this.tokenService.getAuthorities();
console.log('Usuario:', this.username);
console.log('Roles:', this.roles);
  }
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
username: any;
roles: any;
}

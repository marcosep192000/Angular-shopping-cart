import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: 'app-vertical-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, MatProgressSpinner, IconComponent],
  templateUrl: './vertical-menu.component.html',
  styleUrl: './vertical-menu.component.css',
})
export class VerticalMenuComponent {
  activeMenu: string | null = null;

  toggleMenu(menu: string) {
    this.activeMenu = this.activeMenu === menu ? null : menu;
  }

  isMenuOpen(menu: string): boolean {
    return this.activeMenu === menu;
  }
}

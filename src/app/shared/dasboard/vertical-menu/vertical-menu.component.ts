import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vertical-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
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

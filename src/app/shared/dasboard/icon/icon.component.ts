import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css',
})
export class IconComponent {
  @Input() iconSrc: string = ''; // Ruta del icono
  @Input() iconAlt: string = ''; // Texto alternativo para accesibilidad
  @Input() size: string = '20px'; // Tamaño del icono
}

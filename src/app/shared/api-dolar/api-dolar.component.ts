import { Dolar } from './../../interfaces/dolar';
import { Component, OnInit } from '@angular/core';
import { ApiDolarService } from '../../services/api-dolar.service';

@Component({
  selector: 'app-api-dolar',
  standalone: true,
  imports: [],
  templateUrl: './api-dolar.component.html',
  styleUrl: './api-dolar.component.css'
})
export class ApiDolarComponent implements OnInit {
  dolarHoy!: Dolar;
  constructor(private dolarService: ApiDolarService) {
    
  }
  ngOnInit(): void {
    this.getDolar();
  }


  getDolar(): void {
    this.dolarService.getDolar().subscribe(d => {
      this.dolarHoy = d;
    });
  }
}

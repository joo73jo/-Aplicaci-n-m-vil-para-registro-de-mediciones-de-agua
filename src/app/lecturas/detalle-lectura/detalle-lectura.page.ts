import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-detalle-lectura',
  templateUrl: './detalle-lectura.page.html',
  styleUrls: ['./detalle-lectura.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class DetalleLecturaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

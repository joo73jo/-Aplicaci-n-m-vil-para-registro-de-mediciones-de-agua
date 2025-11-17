import { Component } from '@angular/core';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonButton, IonInput
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../core/supabase.service';

@Component({
  standalone: true,
  selector: 'app-nueva-lectura',
  templateUrl: './nueva-lectura.page.html',
  styleUrls: ['./nueva-lectura.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonButton, IonInput
  ]
})
export class NuevaLecturaPage {

  medidorId = '';
  valor: number | null = null;
  observaciones = '';
  errorMsg = '';

  fotoMedidorFile: File | null = null;
  fotoFachadaFile: File | null = null;

  latitud: number | null = null;
  longitud: number | null = null;

  constructor(
    private supa: SupabaseService,
    private router: Router
  ) {}

  async tomarFotoMedidor() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';

    input.onchange = () => {
      const file = input.files?.[0] || null;
      this.fotoMedidorFile = file;
    };

    input.click();
  }

  async tomarFotoFachada() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';

    input.onchange = () => {
      const file = input.files?.[0] || null;
      this.fotoFachadaFile = file;
    };

    input.click();
  }

  async obtenerUbicacion() {
    return new Promise<void>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.latitud = pos.coords.latitude;
          this.longitud = pos.coords.longitude;
          resolve();
        },
        (err) => reject(err),
        { enableHighAccuracy: true }
      );
    });
  }

  async guardarLectura() {
    this.errorMsg = '';

    if (!this.medidorId || this.valor === null) {
      this.errorMsg = 'Falta información';
      return;
    }

    // obtener coordenadas
    try {
      await this.obtenerUbicacion();
    } catch {
      this.errorMsg = 'No se pudo obtener la ubicación';
      return;
    }

    const { data: auth } = await this.supa.client.auth.getUser();
    const user = auth?.user;
    if (!user) {
      this.errorMsg = 'Usuario no autenticado';
      return;
    }

    // subir fotos
    let urlMedidor = null;
    let urlFachada = null;

    if (this.fotoMedidorFile) {
      const { data } = await this.supa.client.storage
        .from('lecturas')
        .upload(`medidor_${Date.now()}.jpg`, this.fotoMedidorFile);

      urlMedidor = data?.path || null;
    }

    if (this.fotoFachadaFile) {
      const { data } = await this.supa.client.storage
        .from('lecturas')
        .upload(`fachada_${Date.now()}.jpg`, this.fotoFachadaFile);

      urlFachada = data?.path || null;
    }

    const mapsUrl = `https://www.google.com/maps?q=${this.latitud},${this.longitud}`;

    // insertar la lectura
    await this.supa.client.from('lecturas').insert({
      medidor_id: this.medidorId,
      valor: this.valor,
      observaciones: this.observaciones,
      latitud: this.latitud,
      longitud: this.longitud,
      maps_url: mapsUrl,
      foto_medidor_url: urlMedidor,
      foto_fachada_url: urlFachada,
      usuario_id: user.id
    });

    this.router.navigate(['/home-medidor']);
  }
}

import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonButton, IonInput, IonLabel
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

import { SupabaseService } from '../../core/supabase.service';

@Component({
  standalone: true,
  selector: 'app-nueva-lectura',
  templateUrl: './nueva-lectura.page.html',
  styleUrls: ['./nueva-lectura.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonButton, IonInput, IonLabel,
    CommonModule, FormsModule
  ]
})
export class NuevaLecturaPage {

  medidor_id = '';
  valor: number | null = null;
  observaciones = '';
  foto_medidor: string | null = null;
  foto_fachada: string | null = null;

  constructor(private supa: SupabaseService) {}

  async tomarFotoMedidor() {
    const img = await Camera.getPhoto({
      quality: 70,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });

    this.foto_medidor = `data:image/jpeg;base64,${img.base64String}`;
  }

  async tomarFotoFachada() {
    const img = await Camera.getPhoto({
      quality: 70,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });

    this.foto_fachada = `data:image/jpeg;base64,${img.base64String}`;
  }

  async save() {
    if (!this.foto_medidor || !this.foto_fachada) {
      alert("Debes tomar las 2 fotos.");
      return;
    }

    let lat = 0;
    let lng = 0;

    try {
      await Geolocation.requestPermissions();

      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000
      });

      lat = pos.coords.latitude;
      lng = pos.coords.longitude;

    } catch (e) {
      console.error(e);
      alert("No se pudo obtener ubicación. Activa el GPS y da permisos a la app.");
      return;
    }

    const { data: userData } = await this.supa.client.auth.getUser();
    const user = userData.user;

    if (!user) {
      alert("Error: usuario no autenticado.");
      return;
    }

    const fotoMedidorName = `medidor_${Date.now()}.jpg`;
    const fotoFachadaName = `fachada_${Date.now()}.jpg`;

    const base64ToBlob = (base64: string) => {
      const byteCharacters = atob(base64.split(',')[1]);
      const byteNumbers = Array.from(byteCharacters, c => c.charCodeAt(0));
      return new Blob([new Uint8Array(byteNumbers)], { type: 'image/jpeg' });
    };

    const blob1 = base64ToBlob(this.foto_medidor);
    const blob2 = base64ToBlob(this.foto_fachada);

    const up1 = await this.supa.client.storage
      .from("lecturas")
      .upload(fotoMedidorName, blob1, { contentType: "image/jpeg" });

    if (up1.error) {
      console.error(up1.error);
      alert("Error subiendo foto 1.");
      return;
    }

    const up2 = await this.supa.client.storage
      .from("lecturas")
      .upload(fotoFachadaName, blob2, { contentType: "image/jpeg" });

    if (up2.error) {
      console.error(up2.error);
      alert("Error subiendo foto 2.");
      return;
    }

    const url1 = this.supa.client.storage
      .from("lecturas")
      .getPublicUrl(fotoMedidorName).data.publicUrl;

    const url2 = this.supa.client.storage
      .from("lecturas")
      .getPublicUrl(fotoFachadaName).data.publicUrl;

    const maps_url = `https://www.google.com/maps?q=${lat},${lng}`;

    const { error } = await this.supa.client
      .from("lecturas")
      .insert({
        medidor_id: this.medidor_id,
        valor: this.valor,
        observaciones: this.observaciones,
        latitud: lat,
        longitud: lng,
        usuario_id: user.id,
        foto_medidor_url: url1,
        foto_fachada_url: url2,
        maps_url: maps_url
      });

    if (error) {
      console.error(error);
      alert("Error inesperado guardando la lectura.");
      return;
    }

    alert("Lectura guardada con éxito.");
    location.href = "/home-medidor";
  }

}

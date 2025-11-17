import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

// Importante para que Supabase funcione bien en Ionic (manejo de sesión)
const supabaseOptions = {
  auth: {
    persistSession: true,     // Mantiene sesión
    autoRefreshToken: true,   // Refresca tokens automáticamente
    detectSessionInUrl: false // Evita problemas en Ionic
  }
};

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  public client: SupabaseClient;

  constructor() {
    this.client = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      supabaseOptions
    );
  }
}

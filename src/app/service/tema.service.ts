import { Observable } from "rxjs";
import { Tema } from "../models/tema.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class TemaService {
  private apiUrl = 'http://localhost:8080/api/v1/tema'; // La URL base de la API para temas
  private temasApi = 'http://localhost:8080/api/v1/temas'; // La URL base de la API para temas
  constructor(private http: HttpClient) {}

  // Obtener todos los temas
  getTemas(): Observable<Tema[]> {
    
    return this.http.get<Tema[]>(this.temasApi);
  }

  // Obtener un tema por ID
  getTema(id: number): Observable<Tema> {
    return this.http.get<Tema>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo tema
  createTema(tema: Tema): Observable<Tema> {
    return this.http.post<Tema>(this.apiUrl, tema);
  }

  // Actualizar un tema existente
  updateTema(id: number, tema: Tema): Observable<Tema> {
    return this.http.put<Tema>(`${this.apiUrl}/${id}`, tema);
  }

  // Eliminar un tema
  deleteTema(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

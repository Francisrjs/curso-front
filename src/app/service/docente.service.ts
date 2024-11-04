import { Observable } from "rxjs";
import { Docente } from "../models/docente.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class DocenteService {
  private apiUrl = 'http://localhost:8080/api/v1/docente'; // La URL base de la API para docentes
  private docentesApi = 'http://localhost:8080/api/v1/docentes'; // La URL base de la API para docentes
  constructor(private http: HttpClient) {}

  // Obtener todos los docentes
  getDocentes(): Observable<Docente[]> {
    
    return this.http.get<Docente[]>(this.docentesApi);
  }

  // Obtener un docente por ID
  getDocente(id: number): Observable<Docente> {
    return this.http.get<Docente>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo docente
  createDocente(docente: Docente): Observable<Docente> {
    return this.http.post<Docente>(this.apiUrl, docente);
  }

  // Actualizar un docente existente
  updateDocente(id: number, docente: Docente): Observable<Docente> {
    return this.http.put<Docente>(`${this.apiUrl}/${id}`, docente);
  }

  // Eliminar un docente
  deleteDocente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

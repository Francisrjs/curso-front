import { Observable } from "rxjs";
import { Alumno } from "../models/alumno.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class AlumnoService {
  private apiUrl = 'http://localhost:8080/api/v1/alumno'; // La URL base de la API para alumnos
  private alumnosApi = 'http://localhost:8080/api/v1/alumnos'; // La URL base de la API para alumnos
  constructor(private http: HttpClient) {}

  // Obtener todos los alumnos
  getAlumnos(): Observable<Alumno[]> {
    
    return this.http.get<Alumno[]>(this.alumnosApi);
  }

  // Obtener un alumno por ID
  getAlumno(id: number): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo alumno
  createAlumno(alumno: Alumno): Observable<Alumno> {
    return this.http.post<Alumno>(this.apiUrl, alumno);
  }

  // Actualizar un alumno existente
  updateAlumno(id: number, alumno: Alumno): Observable<Alumno> {
    return this.http.put<Alumno>(`${this.apiUrl}/${id}`, alumno);
  }

  // Eliminar un alumno
  deleteAlumno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

import { Tema } from "./tema.model";
import { Docente } from "./docente.model";
import { Alumno } from "./alumno.model";

export class Curso {
  id: number;
  tema: Tema;
  fechaInicio: Date;
  fechaFin: Date;
  docente?: Docente; // Opcional
  precio: number;
  alumnos: Alumno[]; // Puede estar vacío al inicio

  constructor() {
    this.id = 0;
    this.tema = new Tema();
    this.fechaInicio = new Date();
    this.fechaFin = new Date();
    this.docente = undefined; // o puedes omitir esta línea si no es necesario
    this.precio = 0;
    this.alumnos = []; // Inicializar como un array vacío
  }
}

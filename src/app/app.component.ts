import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AlumnoDetailComponent } from './components/alumno-detail/alumno-detail.component';
import { FormsModule } from '@angular/forms';
import { AlumnoFormComponent } from './components/alumno-form/alumno-form.component';
import { DocenteDetailComponent } from './components/docente-detail/docente-detail.component';
import { DocenteFormComponent } from './components/docente-form/docente-form.component';

@Component({
     selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, CommonModule, AlumnoDetailComponent, RouterLink, FormsModule, AlumnoFormComponent, DocenteDetailComponent, DocenteFormComponent]
})
export class AppComponent {

  data = {
    titulo: 'Cursos',
    description: 'Desarrollo de Software- Rojas Francis Joel',
    List_caption: ['Alumnos','Docentes','Temas'],
    Add_caption: 'Agregar ',
    Search_caption: 'Buscar'
  }}
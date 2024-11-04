import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Alumno } from '../../models/alumno.model';
import { AlumnoService } from '../../service/alumno.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AlumnoFormComponent } from '../alumno-form/alumno-form.component';

@Component({
  selector: 'app-alumno-detail',
  templateUrl: './alumno-detail.component.html',
  standalone: true,
  styleUrls: ['./alumno-detail.component.css'],
  imports: [CommonModule, AlumnoFormComponent],
})
export class AlumnoDetailComponent implements OnInit {
  alumnos: Alumno[] = [];
  hoveredAlumno: Alumno | null = null;
  selectedAlumno: Alumno | null = null;
  formVisible: boolean = false;

  @ViewChild(AlumnoFormComponent) alumnoFormComponent!: AlumnoFormComponent; // Use ViewChild to access the component

  constructor(
    private alumnoService: AlumnoService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.retrieveAlumnos();
  }

  onMouseEnter(alumno: Alumno): void {
    this.hoveredAlumno = alumno;
  }

  onMouseLeave(): void {
    this.hoveredAlumno = null;
  }

  retrieveAlumnos(): void {
    this.alumnoService.getAlumnos().subscribe({
      next: (data) => {
        this.alumnos = data;
        if (this.alumnos.length > 0) this.selectedAlumno = this.alumnos[0];
      },
      error: (e) => {
        this.toastr.error('Error obteniendo alumnos: ' + e.error.message, 'Error!', {
          positionClass: 'toast-center-center',
          timeOut: 6000,
        });
      },
    });
  }

  onDelete(alumno: Alumno): void {
    this.selectedAlumno = alumno;
    if (confirm('¿Seguro que quieres eliminar a este alumno?')) {
      this.alumnoService.deleteAlumno(alumno.id).subscribe({
        next: () => {
          this.toastr.success('Alumno eliminado con éxito!', 'Eliminado!');
          this.retrieveAlumnos();
        },
        error: (error) => {
          this.toastr.error('Error obteniendo alumnos: ' + error.message, 'Error!', {
            positionClass: 'toast-center-center',
            timeOut: 6000,
          });
        },
      });
    }
  }

  onEdit(alumno: Alumno): void {
    this.selectedAlumno = alumno;
    this.formVisible = true;
  }

  closeForm() {
    this.formVisible = false;
  }

  getEdad(fechaNacimiento: Date | string): number {
    const fecha = typeof fechaNacimiento === 'string' ? new Date(fechaNacimiento) : fechaNacimiento;
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }
    return edad;
  }
}
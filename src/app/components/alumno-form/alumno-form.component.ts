import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AlumnoService } from '../../service/alumno.service';
import { ToastrService } from 'ngx-toastr';
import { Alumno } from '../../models/alumno.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alumno-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './alumno-form.component.html',
  styleUrls: ['./alumno-form.component.css'],
})
export class AlumnoFormComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  @Input() alumno: Alumno | null = null;
  enableIdEdit: boolean = false;
  isEditMode: boolean = false;
  public newAlumno: Alumno = new Alumno(); // Inicializa newAlumno con una instancia de Alumno

  constructor(
    private alumnoService: AlumnoService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.alumno) {
      // Cuando se recibe un alumno en modo edición
      this.newAlumno = { ...this.alumno };
      this.enableIdEdit = true;
      this.isEditMode = true;
    } else {
      // Si es un nuevo alumno
      this.resetForm();
    }
  }

  OnSave() {
    if (this.isEditMode) {
      this.saveEditAlumno();
    } else {
      this.saveNewAlumno();
    }
    // No resetear el formulario aquí, ya que queremos que la página se actualice
  }

  private saveNewAlumno(): void {
    this.alumnoService.createAlumno(this.newAlumno).subscribe({
      next: (res) => {
        this.toastr.success('Alumno creado con éxito!', 'Success!', {
          positionClass: 'toast-center-center',
          timeOut: 2000,
        });
        // Redirigir a la página de alumnos
        this.router.navigate(['/redirect/alumnos']);
      },
      error: (e) => {
        this.toastr.error(
          `Error creando alumno. Exception: ${e.error.message}`,
          'Error!',
          {
            positionClass: 'toast-center-center',
            timeOut: 6000,
          }
        );
      },
    });
  }

  saveEditAlumno() {
    this.alumnoService.updateAlumno(this.newAlumno.id, this.newAlumno).subscribe({
      next: (res) => {
        this.toastr.success('Alumno actualizado con éxito!', 'Success!', {
          positionClass: 'toast-center-center',
          timeOut: 2000,
        });
        // Redirigir a la página de alumnos
        this.router.navigate(['/redirect/alumnos']); 
      },
      error: (e) => {
        this.toastr.error(
          `Error actualizando alumno. Exception: ${e.error.message}`,
          'Error!',
          {
            positionClass: 'toast-center-center',
            timeOut: 6000,
          }
        );
      },
    });
  }

  resetForm() {
    this.newAlumno = new Alumno(); // Reinicia el formulario
    this.enableIdEdit = false;
    this.isEditMode = false;
  }

  closeForm() {
    this.close.emit(); // Cierra el formulario al guardar
  }

  onEnableIdEditChange() {
    if (this.enableIdEdit) {
      this.isEditMode = true;
      console.log(this.isEditMode);
      console.log("editar habilitado");
    } else {
      this.resetForm();
    }
  }
}

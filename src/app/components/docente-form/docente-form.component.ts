import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DocenteService } from '../../service/docente.service';
import { ToastrService } from 'ngx-toastr';
import { Docente } from '../../models/docente.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-docente-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './docente-form.component.html',
  styleUrls: ['./docente-form.component.css'],
})
export class DocenteFormComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  @Input() docente: Docente | null = null;
  enableIdEdit: boolean = false;
  isEditMode: boolean = false;
  public newDocente: Docente = new Docente(); // Inicializa newDocente con una instancia de Docente

  constructor(
    private docenteService: DocenteService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.docente) {
      // Cuando se recibe un docente en modo edición
      this.newDocente = { ...this.docente };
      this.enableIdEdit = true;
      this.isEditMode = true;
    } else {
      // Si es un nuevo docente
      this.resetForm();
    }
  }

  OnSave() {
    if (this.isEditMode) {
      this.saveEditDocente();
    } else {
      this.saveNewDocente();
    }
    // No resetear el formulario aquí, ya que queremos que la página se actualice
  }

  private saveNewDocente(): void {
    this.docenteService.createDocente(this.newDocente).subscribe({
      next: (res) => {
        this.toastr.success('Docente creado con éxito!', 'Success!', {
          positionClass: 'toast-center-center',
          timeOut: 2000,
        });
        // Redirigir a la página de docentes
        this.router.navigate(['/redirect/docentes']);
      },
      error: (e) => {
        this.toastr.error(
          `Error creando docente. Exception: ${e.error.message}`,
          'Error!',
          {
            positionClass: 'toast-center-center',
            timeOut: 6000,
          }
        );
      },
    });
  }

  saveEditDocente() {
    this.docenteService.updateDocente(this.newDocente.id, this.newDocente).subscribe({
      next: (res) => {
        this.toastr.success('Docente actualizado con éxito!', 'Success!', {
          positionClass: 'toast-center-center',
          timeOut: 2000,
        });
        // Redirigir a la página de docentes
        this.router.navigate(['/redirect/docentes']); 
      },
      error: (e) => {
        this.toastr.error(
          `Error actualizando docente. Exception: ${e.error.message}`,
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
    this.newDocente = new Docente(); // Reinicia el formulario
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

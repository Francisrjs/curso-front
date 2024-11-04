import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TemaService } from '../../service/tema.service';
import { ToastrService } from 'ngx-toastr';
import { Tema } from '../../models/tema.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tema-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tema-form.component.html',
  styleUrls: ['./tema-form.component.css'],
})
export class TemaFormComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  @Input() tema: Tema | null = null;
  enableIdEdit: boolean = false;
  isEditMode: boolean = false;
  public newTema: Tema = new Tema(); // Inicializa newTema con una instancia de Tema

  constructor(
    private temaService: TemaService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.tema) {
      // Cuando se recibe un tema en modo edición
      this.newTema = { ...this.tema };
      this.enableIdEdit = true;
      this.isEditMode = true;
    } else {
      // Si es un nuevo tema
      this.resetForm();
    }
  }

  OnSave() {
    if (this.isEditMode) {
      this.saveEditTema();
    } else {
      this.saveNewTema();
    }
    // No resetear el formulario aquí, ya que queremos que la página se actualice
  }

  private saveNewTema(): void {
    this.temaService.createTema(this.newTema).subscribe({
      next: (res) => {
        this.toastr.success('Tema creado con éxito!', 'Success!', {
          positionClass: 'toast-center-center',
          timeOut: 2000,
        });
        // Redirigir a la página de temas
        this.router.navigate(['/redirect/temas']);
      },
      error: (e) => {
        this.toastr.error(
          `Error creando tema. Exception: ${e.error.message}`,
          'Error!',
          {
            positionClass: 'toast-center-center',
            timeOut: 6000,
          }
        );
      },
    });
  }

  saveEditTema() {
    this.temaService.updateTema(this.newTema.id, this.newTema).subscribe({
      next: (res) => {
        this.toastr.success('Tema actualizado con éxito!', 'Success!', {
          positionClass: 'toast-center-center',
          timeOut: 2000,
        });
        // Redirigir a la página de temas
        this.router.navigate(['/redirect/temas']); 
      },
      error: (e) => {
        this.toastr.error(
          `Error actualizando tema. Exception: ${e.error.message}`,
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
    this.newTema = new Tema(); // Reinicia el formulario
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

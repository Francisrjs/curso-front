import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { Tema } from '../../models/tema.model';
import { TemaService } from '../../service/tema.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TemaFormComponent } from '../tema-form/tema-form.component';

@Component({
  selector: 'app-tema-detail',
  standalone: true,
  imports: [CommonModule,TemaFormComponent],
  templateUrl: './tema-detail.component.html',
  styleUrl: './tema-detail.component.css'
})
export class TemaDetailComponent {

  temas: Tema[] = [];
  hoveredTema: Tema | null = null;
  selectedTema: Tema | null = null;
  formVisible: Boolean=false;
  @Input() tema!: Tema; // Define el input tema
  @ViewChild(TemaFormComponent) TemaFormComponent!: TemaFormComponent; // Use ViewChild to access the component
  constructor(
    private temaService: TemaService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  closeForm() {
    this.formVisible = false;
  }
onEdit(tema: Tema): void {
  this.selectedTema = tema;
  this.formVisible = true;
}

  ngOnInit(): void {
    this.retrieveTemas();
  }
  
  onMouseEnter(tema: Tema): void {
    this.hoveredTema = tema;
  }

  onMouseLeave(): void {
    this.hoveredTema = null;
  }

  retrieveTemas(): void {
    this.temaService.getTemas().subscribe({
      next: (data) => {
        this.temas = data;
        if (this.temas.length > 0) this.selectedTema = this.temas[0];
      },
      error: (e) => {
        this.toastr.error('Error obteniendo temas: ' + e.error.message, 'Error!', {
          positionClass: 'toast-center-center',
          timeOut: 6000
        });
      }
    });
  }

  onDelete(tema: Tema): void {
    this.selectedTema = tema;
    if (confirm('¿Seguro que quieres eliminar a este tema?')) {
      this.temaService.deleteTema(tema.id).subscribe({
        next: () => {
          this.toastr.success('Tema eliminado con éxito!', 'Eliminado!');
          this.retrieveTemas();
        },
        error: (error) => {
          if (error.error.message.includes('foreign key constraint fails')) {
            this.toastr.error('No se puede eliminar el tema porque está asociado a un curso.', 'Error!');
          } else {
            this.toastr.error('Error al eliminar el tema: ' + error.error.message, 'Error!');
          }
        }
      });
    }
  }


}
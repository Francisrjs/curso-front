import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { Docente } from '../../models/docente.model';
import { DocenteService } from '../../service/docente.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DocenteFormComponent } from '../docente-form/docente-form.component';

@Component({
  selector: 'app-docente-detail',
  standalone: true,
  imports: [CommonModule,DocenteFormComponent],
  templateUrl: './docente-detail.component.html',
  styleUrl: './docente-detail.component.css'
})
export class DocenteDetailComponent {

  docentes: Docente[] = [];
  hoveredDocente: Docente | null = null;
  selectedDocente: Docente | null = null;
  formVisible: Boolean=false;
  @Input() docente!: Docente; // Define el input docente
  @ViewChild(DocenteFormComponent) DocenteFormComponent!: DocenteFormComponent; // Use ViewChild to access the component
  constructor(
    private docenteService: DocenteService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  closeForm() {
    this.formVisible = false;
  }
onEdit(docente: Docente): void {
  this.selectedDocente = docente;
  this.formVisible = true;
}

  ngOnInit(): void {
    this.retrieveDocentes();
  }
  
  onMouseEnter(docente: Docente): void {
    this.hoveredDocente = docente;
  }

  onMouseLeave(): void {
    this.hoveredDocente = null;
  }

  retrieveDocentes(): void {
    this.docenteService.getDocentes().subscribe({
      next: (data) => {
        this.docentes = data;
        if (this.docentes.length > 0) this.selectedDocente = this.docentes[0];
      },
      error: (e) => {
        this.toastr.error('Error obteniendo docentes: ' + e.error.message, 'Error!', {
          positionClass: 'toast-center-center',
          timeOut: 6000
        });
      }
    });
  }

  onDelete(docente: Docente): void {
    this.selectedDocente = docente;
    if (confirm('¿Seguro que quieres eliminar a este docente?')) {
      this.docenteService.deleteDocente(docente.id).subscribe({
        next: () => {
          this.toastr.success('Docente eliminado con éxito!', 'Eliminado!');
          this.retrieveDocentes();
        },
        error: (error) => {
          if (error.error.message.includes('foreign key constraint fails')) {
            this.toastr.error('No se puede eliminar el docente porque está asociado a un curso.', 'Error!');
          } else {
            this.toastr.error('Error al eliminar el docente: ' + error.error.message, 'Error!');
          }
        }
      });
    }
  }


}
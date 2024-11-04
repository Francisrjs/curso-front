import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormsModule, FormArray } from '@angular/forms';
import { CursoService } from '../../service/curso.service';
import { Curso } from '../../models/curso.model';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TemaService } from '../../service/tema.service';
import { DocenteService } from '../../service/docente.service';
import { AlumnoService } from '../../service/alumno.service';
import { Alumno } from '../../models/alumno.model';
import { NgSelectModule } from '@ng-select/ng-select';
import {  CursoFormComponent } from "../curso-form/curso-form.component";

@Component({
  selector: 'app-curso-detail',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule, NgSelectModule, CursoFormComponent],
  templateUrl: './curso-detail.component.html',
  styleUrl: './curso-detail.component.css',

})
export class CursoDetailComponent {
  formVisible: boolean=false;
  filteredCursosList: Curso[] = [];
  searchTerm: string = '';
  fechaFin: string = '';
  @ViewChild(CursoFormComponent) cursoFormComponent!: CursoFormComponent;
  idDocente: number | null = null;
  temas: any[] = [];
  docentes: any[] = [];
  cursos: Curso[] = [];
  alumnosDisponibles: any[] = []; 
  cursoForm: FormGroup;
  editing = false;  
  currentCursoId: number | null = null;  
  curso: any;
  alumnosSeleccionados: number[] = []; // Alumnos ya seleccionados

  constructor(
    private fb: FormBuilder, 
    private cursoService: CursoService,
    private temaService: TemaService,
    private docenteService: DocenteService,
    private alumnoService: AlumnoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.cursoForm = this.fb.group({
      docente: ['', Validators.required],
      tema: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      precio: [0, [Validators.required]],
      alumnos: this.fb.array([]),  // Inicializa el grupo de alumnos
    });
  }
  ngOnInit(): void {
    this.getAllCursos();
    this.cargarTemas();
    this.cargarDocentes();
    
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.obtenerCurso(id);
    
    }
  }
  closeForm() {
    this.formVisible = false;
  }
  editCurso(cursoId: number): void {
    console.log(cursoId);
    this.formVisible = true;
    this.obtenerCurso(cursoId); // Llama a la función que carga el curso para editar
  }

  deleteCurso(id: number): void {
    this.cursoService.deleteCurso(id).subscribe(() => {
      this.getAllCursos(); 
    });
  }
  cargarTemas(): void {
    this.temaService.getTemas().subscribe((temas) => {
      this.temas = temas;
    });
  }

  cargarDocentes(): void {
    this.docenteService.getDocentes().subscribe((docentes) => {
      this.docentes = docentes;
    });
  }

  buscarCursosByFechaFin(): void {
    if (this.fechaFin) {
      this.cursoService.getCursosByFechaFin(this.fechaFin).subscribe(
        (data) => {
          this.cursos = data; 
          this.searchTerm = ''; 
          this.idDocente = null;
        },
        (error) => {
          console.error('Error al obtener los cursos:', error);
        }
      );
    }
  }
  getFilteredCursos(): Curso[] {
    let filteredCursos = this.cursos.filter(curso => 
      this.searchTerm ? curso.tema.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) : true
    );

    if (this.fechaFin) {
      filteredCursos = filteredCursos.filter(curso => new Date(curso.fechaFin) <= new Date(this.fechaFin));
    }

    return filteredCursos;
  }

  getAllCursos(): void {
    this.cursoService.getCursos().subscribe((data) => {
      this.cursos = data;
    });
  }

  get alumnosFormArray(): FormArray {
    return this.cursoForm.get('alumnos') as FormArray;
  }

  obtenerCurso(id: number): void {
    this.cursoService.getCursoById(id).subscribe(
      (data) => {
        this.curso = data;
        console.log(this.curso.tema);
        this.cursoFormComponent.populateCursoForm(data);
      },
      (error) => {
        console.error('Error al obtener los detalles del curso:', error);
      }
    );
  }
  


}

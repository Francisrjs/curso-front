import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormsModule, FormArray, FormControl } from '@angular/forms';
import { CursoService } from '../../service/curso.service';
import { Curso } from '../../models/curso.model';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TemaService } from '../../service/tema.service';
import { DocenteService } from '../../service/docente.service';
import { AlumnoService } from '../../service/alumno.service';
import { Alumno } from '../../models/alumno.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-curso-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './curso-form.component.html',
  styleUrls: ['./curso-form.component.css']
})
export class CursoFormComponent implements OnInit {
  @Input() curso: Curso| null=null;
  @Output() close = new EventEmitter<void>();
  filteredCursosList: Curso[] = [];
  searchTerm: string = '';
  fechaFin: string = '';
  enableIdEditFormControl = new FormControl(false);
  idDocente: number | null = null;
  temas: any[] = [];
  docentes: any[] = [];
  cursos: Curso[] = [];
  alumnosDisponibles: any[] = []; 
  cursoForm: FormGroup;
  editing = false;  
  alumnos: Alumno[]=[];
  currentCursoId: number | null = null;  
  alumnosSeleccionados: number[] = []; // Alumnos ya seleccionados

  //edicion
  enableIdEdit: boolean = true;
  isEditMode: boolean = true;
  public newCurso: Curso = new Curso(); // Inicializa newAlumno con una instancia de Alumno



  constructor(
    private fb: FormBuilder, 
    private cursoService: CursoService,
    private temaService: TemaService,
    private docenteService: DocenteService,
    private alumnoService: AlumnoService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.cursoForm = this.fb.group({
      id: [{ value: '', disabled: !this.enableIdEdit }, Validators.required],
      tema: ['', Validators.required],
      docente: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      precio: [0, Validators.required],
      alumnos: this.fb.array([]),
      enableIdEdit: [false] 
    });
    
  }

  ngOnInit(): void {
    this.getAllCursos();
    this.cargarTemas();
    this.cargarDocentes();
    this.cargarEstudiantesDisponibles();
    this.enableIdEditFormControl.setValue(false);
    if (this.curso) {
      console.log("recibi curso");
      this.newCurso = { ...this.curso }; // Spread operator to avoid mutation
      this.enableIdEdit = true;
      this.isEditMode = true;
      
      this.populateCursoForm(this.curso); // Call after assigning curso
      
    } else {
      // Si es un nuevo alumno
      this.resetForm();
    }
    
  }

  getAllCursos(): void {
    this.cursoService.getCursos().subscribe((data) => {
      this.cursos = data;
    });
  }

  get alumnosFormArray(): FormArray {
    return this.cursoForm.get('alumnos') as FormArray;
  }


  populateCursoForm(curso: any): void {
    this.enableIdEdit = true;
    if (curso) {
        this.enableIdEditFormControl.setValue(true); // Set enableIdEdit to true only when there's a course

        // Si necesitas editar la información de los alumnos, carga los objetos completos:
        const alumnosFormArrayData = curso.alumnos.map((alumno: { id: any; }) => ({
            alumnoId: alumno.id,
            // Otros campos del alumno si son necesarios para edición
        }));

        this.cursoForm.patchValue({
            enableIdEdit: true,
            id: curso.id,
            docente: curso.docente,
            tema: curso.tema,
            fechaInicio: curso.fechaInicio,
            fechaFin: curso.fechaFin,
            precio: curso.precio,
            alumnos: alumnosFormArrayData
        });

        this.alumnosFormArray.clear(); // Limpia el FormArray antes de llenarlo
        curso.alumnos.forEach((alumno: { id: any; }) => {
            const nuevoAlumnoControl = this.fb.group({
                alumnoId: [alumno.id, Validators.required]
            });
            this.alumnosFormArray.push(nuevoAlumnoControl); // Agrega el nuevo FormGroup al FormArray
            
        });
    }
}
  cargarEstudiantesDisponibles(): void {
    this.alumnoService.getAlumnos().subscribe(
      (data) => {
        this.alumnosDisponibles = data;
        console.table(this.alumnosDisponibles);
      },
      (error) => {
        console.error('Error al obtener los estudiantes disponibles:', error);
      }
    );
  }

  getAlumnosDisponibles() {
    return this.alumnosDisponibles.filter(alumno => 
      !this.alumnosSeleccionados.includes(alumno.id)
    );
  }
  OnSave() {
    const cursoData = this.cursoForm.value;
    // Asegúrate de que solo envíes los IDs de los alumnos
    cursoData.alumnos = this.alumnosFormArray.controls.map(control => {

        return { id: control.value.alumnoId }; // Envía solo el ID
    });
    

    if (this.enableIdEditFormControl.value) {
      this.saveEditCurso(); // Call edit function if checkbox is enabled
    } else {
      this.saveNewCurso(); // Call create function if checkbox is disabled
    }
  }
  private saveNewCurso() {
    console.log(this.cursoForm.value);
    this.cursoService.createCurso(this.cursoForm.value).subscribe({
      next: (res) => {
        this.toastr.success('Curso creado con éxito!', 'Success!');
        this.resetForm();
        this.router.navigate(['/redirect/cursos']);
      },
      error: (err) => {
        this.toastr.error(`Error creando curso: ${err.error.message}`, 'Error');
      },
    });
  }
  
  private saveEditCurso() {
    const id = this.cursoForm.get('id')?.value;
    console.log(this.cursoForm.value);
    this.cursoService.updateCurso(id, this.cursoForm.value).subscribe({
      next: (res) => {
        this.toastr.success('Curso actualizado con éxito!', 'Success!');
        this.resetForm();
        this.router.navigate(['/redirect/cursos']);
      },
      error: (err) => {
        this.toastr.error(`Error actualizando curso: ${err.error.message}`, 'Error');
      },
    });
  }
  


  closeForm() {
    this.close.emit(); // Cierra el formulario al guardar
  }
  inscribirAlumnoEnCurso(alumnoId: number): void {
    if (!this.alumnosSeleccionados.includes(alumnoId)) {
      // Crear un nuevo FormGroup para el alumno que contiene el ID del alumno seleccionado
      const nuevoAlumno = this.fb.group({
        alumnoId: [alumnoId, Validators.required] // Establece el ID del alumno
      });
      
      // Agrega el nuevo FormGroup al FormArray de alumnos
      this.alumnosFormArray.push(nuevoAlumno);
      this.alumnosSeleccionados.push(alumnoId); // Agregar a la lista de seleccionados
    } else {
      alert('Este alumno ya ha sido seleccionado.');
    }
  }
  removerAlumnoEnCurso(alumnoId: number): void {
    // Verificamos si this.curso existe y tiene un id
    if (this.curso && this.curso.id) {
      this.cursoService.removerAlumno(this.curso.id, alumnoId).subscribe(
        () => {
          alert('Alumno removido exitosamente');
          // Eliminar el alumno de la lista de seleccionados
          this.alumnosSeleccionados = this.alumnosSeleccionados.filter(id => id !== alumnoId);
        },
        (error) => {
          console.error('Error al remover alumno:', error);
        }
      );
    } else {
      console.error('Error: El curso no está definido o no tiene un id.');
    }
  }

  resetForm(): void {
    this.cursoForm.reset({
      tema: '',
      fechaInicio: '',
      fechaFin: '',
      docente: '',
      precio: 0,
      alumnos: [],
    });
    this.enableIdEditFormControl.setValue(false);
    this.editing = false; 
    this.currentCursoId = null; 
    console.log("editar");
    this.alumnosFormArray.clear();
    this.alumnosSeleccionados = []; // Resetea la lista de alumnos seleccionados
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

  agregarAlumno(alumnoId?: number): void {
    const alumnoGroup = this.fb.group({
      alumnoId: [alumnoId || null, Validators.required],
    });
    this.alumnosFormArray.push(alumnoGroup); // Agrega el nuevo FormGroup al FormArray
  }
  
  eliminarAlumno(index: number) {
    const alumnoId = this.alumnosFormArray.controls[index].value.alumnoId;
    this.alumnosSeleccionados = this.alumnosSeleccionados.filter(id => id !== alumnoId); // Eliminar el ID del alumno que se va a eliminar
    this.alumnosFormArray.removeAt(index);
  }
  yaSeleccionado(alumnoId: number, index: number): boolean {
    // Verifica si el alumno ya está seleccionado en algún otro control del FormArray
    for (let i = 0; i < this.alumnosFormArray.length; i++) {
      // No verifica el control actual (index) para evitar que se desactive la opción seleccionada en el mismo control
      if (i !== index) {
        const controlValue = this.alumnosFormArray.at(i).get('alumnoId')?.value;
        if (controlValue === alumnoId) {
          return true; // El alumno ya está seleccionado
        }
      }
    }
    return false; // El alumno no está seleccionado
  }
  

  onEnableIdEditChange() {
    console.log("click");
    if(this.enableIdEditFormControl.value){
      console.log("verdadero");
      this.isEditMode = true;
      console.log(this.isEditMode);
      console.log("editar habilitado");
      this.enableIdEditFormControl.setValue(true);
     
    }else{
      console.log("falso");
      this.enableIdEditFormControl.setValue(false);
      this.cursoForm.patchValue({ id: null });
    }

    
  }
}

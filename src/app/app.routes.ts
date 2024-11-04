// app-routing.module.ts (o app.routes.ts)
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlumnoDetailComponent } from './components/alumno-detail/alumno-detail.component';
import { AlumnoFormComponent } from './components/alumno-form/alumno-form.component';
import { DocenteDetailComponent } from './components/docente-detail/docente-detail.component';
import { RedirectComponent } from './components/redirect/redirect.component';
import { TemaFormComponent } from './components/tema-form/tema-form.component';
import { TemaDetailComponent } from './components/tema-detail/tema-detail.component';
import { CursoDetailComponent } from './components/curso-detail/curso-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/cursos', pathMatch: 'full' },
  { path: 'alumnos', component: AlumnoDetailComponent },
  { path: 'alumno-form/:id', component: AlumnoFormComponent },
  { path: 'redirec', component: RedirectComponent },
  { path: 'redirect/:page', component: RedirectComponent },
  { path: 'alumno-form', component: AlumnoFormComponent },
  {path: 'docentes', component:DocenteDetailComponent},
  { path: 'temas', component: TemaDetailComponent },
  { path: 'cursos', component: CursoDetailComponent},
  

  // Otras rutas...
];
@NgModule({
  imports: [RouterModule.forRoot(routes)], // Importar RouterModule con las rutas definidas
  exports: [RouterModule] // Exportar RouterModule para que se pueda usar en otros módulos
})
export class AppRoutingModule {}

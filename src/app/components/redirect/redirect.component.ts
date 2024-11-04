import { Component, OnInit } from '@angular/core';
import { routes } from '../../app.routes';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [],
  templateUrl: './redirect.component.html',
  styleUrl: './redirect.component.css'
})
export class RedirectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute, // Use ActivatedRoute to access route parameters
    private router: Router
  ) {}

  ngOnInit(): void {
    const page = this.route.snapshot.paramMap.get('page');
    if (page) {
      console.log('ID capturado desde la ruta:', page);
      this.router.navigate([`/${page}`]);
    } else {
      console.error('No se encontró el ID en la ruta');
    }
  }
}  
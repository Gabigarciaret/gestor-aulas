import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.html',
  styleUrl: './coming-soon.css'
})
export class ComingSoon {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/home']);
  }
}

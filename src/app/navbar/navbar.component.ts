import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public usuarioLogado: Observable<firebase.User | null>;
  public estaColapsada: boolean = false;
  public x: string;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuarioLogado = this.authService.usuarioLogado;

    this.authService.usuarioLogado.subscribe(usuario => this.x = usuario?.email!);
  }

  public sair() {
    this.authService.logout()
      .then(() => this.router.navigate(['login']));
  }
}

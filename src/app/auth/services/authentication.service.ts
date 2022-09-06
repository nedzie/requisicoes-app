import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public usuarioLogado: Observable<firebase.User | null>

  constructor(private auth: AngularFireAuth) {
    this.usuarioLogado = auth.authState;
  }

  public cadastrar(email: string, senha: string): Promise<firebase.auth.UserCredential> {
    return this.auth.createUserWithEmailAndPassword(email, senha);
  }

  public login(email: string, senha: string): Promise<firebase.auth.UserCredential> {
    return this.auth.signInWithEmailAndPassword(email, senha);
  }

  public logout(): Promise<void> {
    return this.auth.signOut();
  }

  public getUser(): Promise<firebase.User | null> {
    console.log(this.auth.currentUser);
    return this.auth.currentUser;
  }

  public updateUser(usuario: firebase.User | null) {
    return this.auth.updateCurrentUser(usuario);
  }

  public getEmail() {
    console.log(firebase.auth().currentUser?.email!)
    return firebase.auth().currentUser?.email!;
  }

  public resetarSenha(email: string): Promise<void> {
    return this.auth.sendPasswordResetEmail(email);
  }
}

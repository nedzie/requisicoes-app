import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable, take } from 'rxjs';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { Funcionario } from '../models/funcionario.model';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private registros: AngularFirestoreCollection<Funcionario>

  constructor(private fireStore: AngularFirestore) {
    this.registros = this.fireStore.collection<Funcionario>("funcionarios");
  }

  public async inserir(registro: Funcionario): Promise<any> {
    if(!registro)
      return Promise.reject("Item inválido");

    const res = await this.registros.add(registro);

    registro.id = res.id;

    this.registros.doc(res.id).set(registro);
  }

  public async editar(registro: Funcionario): Promise<void> {
    return this.registros.doc(registro.id).set(registro);
  }

  public excluir(registro: Funcionario): Promise<void> {
    return this.registros.doc(registro.id).delete();
  }

  public selecionarTodos(): Observable<Funcionario[]> {
    return this.registros.valueChanges()
    .pipe(
      map((funcionarios: Funcionario[]) => {
        funcionarios.forEach(funcionario => {
          this.fireStore
            .collection<Departamento>("departamentos")
            .doc(funcionario.departamentoId)
            .valueChanges()
            .subscribe(x => funcionario.departamento = x)
        });
        return funcionarios;
      })
    );
  }

  public selecionarFuncionarioLogado(email: string): Observable<Funcionario> {
    return this.fireStore.collection<Funcionario>("funcionarios",
      ref => ref.where("email", "==", email)).valueChanges()
      .pipe(
        take(1),
        map(funcionarios => funcionarios[0]),
        map(funcionario => {
          this.fireStore
            .collection<Departamento>("departamentos")
            .doc(funcionario.departamentoId)
            .valueChanges()
            .subscribe(x => funcionario.departamento = x)
            return funcionario;
        })
      );
  }
}

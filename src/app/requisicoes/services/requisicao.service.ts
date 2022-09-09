import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { Requisicao } from '../models/requisicao.model';

@Injectable({
  providedIn: 'root'
})
export class RequisicaoService {
private registros: AngularFirestoreCollection<Requisicao>

  constructor(private fireStore: AngularFirestore) {
    this.registros = this.fireStore.collection<Requisicao>("requisicoes");
  }

  public async inserir(registro: Requisicao): Promise<any> {
    if(!registro)
      return Promise.reject("Item inválido");

    const res = await this.registros.add(registro);

    registro.id = res.id;

    this.registros.doc(res.id).set(registro);
  }

  public async editar(registro: Requisicao): Promise<void> {
    return this.registros.doc(registro.id).set(registro);
  }

  public excluir(registro: Requisicao): Promise<void> {
    return this.registros.doc(registro.id).delete();
  }

  public selecionarTodos(): Observable<Requisicao[]> {
    return this.registros.valueChanges()
    .pipe(
      map((requisicoes: Requisicao[]) => {
        requisicoes.forEach(requisicao => {
          this.fireStore
            .collection<Departamento>("departamentos")
            .doc(requisicao.departamentoId)
            .valueChanges()
            .subscribe(d => requisicao.departamento = d); //Aqui
          this.preencherDepFuncionario(requisicao);
          if(requisicao.equipamentoId) {
            this.fireStore
              .collection<Equipamento>("equipamentos")
              .doc(requisicao.equipamentoId)
              .valueChanges()
              .subscribe(e => requisicao.equipamento = e);
          }
        });
        return requisicoes;
      })
    );
  }

  private preencherDepFuncionario(requisicao: Requisicao) {
    this.fireStore
      .collection<Funcionario>("funcionarios")
      .doc(requisicao.funcionarioId)
      .valueChanges()
      .pipe(
        map(funcionario => {
          this.fireStore
            .collection<Departamento>("departamentos")
            .doc(funcionario?.departamentoId)
            .valueChanges()
            .subscribe(d => requisicao.funcionario!.departamento = d)
        })
      ).subscribe();
  }

  public selecionarRequisicoesDoFuncionarioAtual(id: string): Observable<Requisicao[]> {
    return this.selecionarTodos()
      .pipe(
        map(requisicoes => {
          return requisicoes.filter(req => req.funcionarioId === id);
        })
      )
  }

  public selecionarRequisicoesDoDepartamentoAtual(id: string): Observable<Requisicao[]> {
    return this.selecionarTodos()
      .pipe(
        map(requisicoes => {
          return requisicoes.filter(req => req.departamentoId === id);
        })
      )
  }
}

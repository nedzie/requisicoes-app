import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable, take } from 'rxjs';
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
          this.fireStore.collection<Funcionario>("funcionarios").doc(requisicao.funcionarioId).valueChanges().subscribe(x => requisicao.funcionario = x!);
          this.fireStore.collection<Departamento>("departamentos").doc(requisicao.departamentoId).valueChanges().subscribe(x => requisicao.departamento = x!);
          this.preencherDepFuncionario(requisicao);
          if (requisicao.equipamentoId)
            this.fireStore.collection<Equipamento>("equipamentos").doc(requisicao.equipamentoId).valueChanges().subscribe(x => requisicao.equipamento = x);
        });
        return requisicoes;
      } )
    )
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

  public selecionarPorId(id: string): Observable<Requisicao> {
    return this.selecionarTodos()
      .pipe(
        take(1), // Ainda retorna um array[]
        map(requisicoes => {
          return requisicoes.filter(req => req.id === id)[0] // Assim retorna só 1 objeto
        })
      )
  }
}

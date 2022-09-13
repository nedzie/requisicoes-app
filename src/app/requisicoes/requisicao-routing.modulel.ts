import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { RequisicaoComponent } from './requisicao.component';
import { RequisicoesDepartamentoComponent } from './requisicoes-departamento/requisicoes-departamento.component';
import { RequisicoesFuncionarioComponent } from './requisicoes-funcionario/requisicoes-funcionario.component';
import { RequisicaoResolver } from './services/requisicao.resolver';

const routes: Routes = [
  {
  path: "", // Ao cair aqui, ele será redirecionado para
  component: RequisicaoComponent,
  children: [ // Todas as rotas começam com /requisicoes/
    { path: "", redirectTo: "funcionario", pathMatch: "full" }, // Cá, e ira marcar a rota "funcionario" como sendo a próxima
    { path: "funcionario", component: RequisicoesFuncionarioComponent },
    { path: "departamento", component: RequisicoesDepartamentoComponent }
  ]
 },
  { path: ":id", component: DetalhesComponent, resolve: { requisicao: RequisicaoResolver } } // : é um parâmetro da rota
  // No caminho que tiver um 'id', carregue o Detalhes e o resolve que conterá as informações é o RequisicaoResolver
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequisicaoRoutingModule { }

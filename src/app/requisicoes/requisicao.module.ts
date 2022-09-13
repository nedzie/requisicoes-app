import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequisicaoComponent } from './requisicao.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { RequisicaoRoutingModule } from './requisicao-routing.modulel';
import { NgSelectModule } from '@ng-select/ng-select';
import { RequisicoesFuncionarioComponent } from './requisicoes-funcionario/requisicoes-funcionario.component';
import { RequisicoesDepartamentoComponent } from './requisicoes-departamento/requisicoes-departamento.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { RequisicoesDepartamentoPipe } from './pipe/requisicoes-departamento.pipe';
import { RequisicoesFuncionarioPipe } from './pipe/requisicoes-funcionario.pipe';

@NgModule({
  declarations: [
    RequisicaoComponent,
    RequisicoesFuncionarioComponent,
    RequisicoesDepartamentoComponent,
    DetalhesComponent,
    RequisicoesDepartamentoPipe,
    RequisicoesFuncionarioPipe
  ],
  imports: [
    CommonModule,
    NgbModule,
    RequisicaoRoutingModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class RequisicaoModule { }

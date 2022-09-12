import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { DepartamentoService } from 'src/app/departamentos/services/departamento.service';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { EquipamentoService } from 'src/app/equipamentos/services/equipamento.service';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Movimentacao } from '../models/movimentacao.model';
import { Requisicao } from '../models/requisicao.model';
import { StatusRequisicao } from '../models/status-requisicao';
import { RequisicaoService } from '../services/requisicao.service';

@Component({
  selector: 'app-requisicoes-departamento',
  templateUrl: './requisicoes-departamento.component.html'
})
export class RequisicoesDepartamentoComponent implements OnInit, OnDestroy {
  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;
  private processoAutenticado$: Subscription;

  public departamentoAtualId: string;
  public funcionarioLogado: Funcionario;
  public requisicaoSelecionada: Requisicao;

  public listaStatus: string[] =
    [
      StatusRequisicao.Aberta,
      StatusRequisicao.Processando,
      StatusRequisicao.NaoAutorizada,
      StatusRequisicao.Finalizada
    ];

  public form: FormGroup;

  constructor(
    private requisicaoService: RequisicaoService,
    private equipamentoService: EquipamentoService,
    private departamentoService: DepartamentoService,
    private funcionarioService: FuncionarioService,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void { // Na tela
    this.processoAutenticado$ = this.authService.usuarioLogado.subscribe(usuario => {
      const email: string = usuario?.email!;
      this.funcionarioService.selecionarFuncionarioLogado(email)
        .subscribe(funcionario => {
          this.departamentoAtualId = funcionario.departamentoId
          this.funcionarioLogado = funcionario
          this.requisicoes$ = this.requisicaoService
            .selecionarRequisicoesDoDepartamentoAtual(this.departamentoAtualId)
      });
    })

    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();

    this.form = this.fb.group({
      status: new FormControl("", [Validators.required]),
      descricao: new FormControl("", [Validators.required, Validators.minLength(6)]),
      funcionario: new FormControl(""),
      dataMovimentacao: new FormControl("")
    });
  }

  ngOnDestroy(): void {
    this.processoAutenticado$.unsubscribe();
  }

  get status(): AbstractControl | null {
    return this.form.get("status");
  }

  public async gravar(modal: TemplateRef<any>, requisicao: Requisicao) {
    this.form.reset();

    this.requisicaoSelecionada = requisicao;
    this.requisicaoSelecionada.movimentacoes = requisicao.movimentacoes ? requisicao.movimentacoes : [];
    this.configurarValoresPadrao();

    try {
      await this.modalService.open(modal).result;

      if(this.form.dirty && this.form.valid) {
        this.atualizarRequisicao(this.form.value);
        await this.requisicaoService.editar(this.requisicaoSelecionada);
      }

    } catch (error) {
      if(error != "fechar" && error != "1" && error != "0")
        this.toastr.error("Houve um erro na solicitação");
    }
  }

  private configurarValoresPadrao() {
    this.form.patchValue({
      funcionario: this.funcionarioLogado,
      status: this.requisicaoSelecionada.status,
      dataMovimentacao: new Date(Date.now()).toLocaleString()
    })
  }

  private atualizarRequisicao(movimentacao: Movimentacao) {
    this.requisicaoSelecionada.movimentacoes.push(movimentacao);
    this.requisicaoSelecionada.status = this.status?.value;
    this.requisicaoSelecionada.ultimaAtualizacao = new Date(Date.now()).toLocaleString();
  }

}

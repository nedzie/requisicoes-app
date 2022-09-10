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
  selector: 'app-requisicoes-funcionario',
  templateUrl: './requisicoes-funcionario.component.html'
})
export class RequisicoesFuncionarioComponent implements OnInit, OnDestroy {
  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;
  private processoAutenticado: Subscription;

  private funcionarioLogado: Funcionario;

  public form: FormGroup;

  constructor(
    private requisicaoService: RequisicaoService,
    private equipamentoService: EquipamentoService,
    private departamentoService: DepartamentoService,
    private funcionarioService: FuncionarioService,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void { // Na tela
    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(""),
      descricao: new FormControl("", [Validators.required, Validators.minLength(2)]),
      dataCriacao: new FormControl(""),

      departamentoId: new FormControl("", [Validators.required]),
      departamento: new FormControl(""),

      funcionarioId: new FormControl(""),
      funcionario: new FormControl(""),

      equipamentoId: new FormControl(""),
      equipamento: new FormControl(""),

      status: new FormControl(""),
      movimentacoes: new FormControl("")
    });

    this.obterFuncionarioLogado();
  }

  ngOnDestroy(): void { // Saiu da tela
    this.processoAutenticado.unsubscribe();
  }

  get tituloModal(): string {
    return this.id?.value ? "Edição" : "Cadastro";
  }

  get id(): AbstractControl | null {
    return this.form.get("id");
  }

  get descricao(): AbstractControl | null {
    return this.form.get("descricao");
  }

  get dataCriacao(): AbstractControl | null {
    return this.form.get("dataCriacao");
  }

  get departamentoId(): AbstractControl | null {
    return this.form.get("departamentoId");
  }

  get equipamentoId(): AbstractControl | null {
    return this.form.get("equipamentoId");
  }

  get funcionarioId(): AbstractControl | null {
    return this.form.get("funcionarioId");
  }

  get movimentacoes(): AbstractControl | null {
    return this.form.get("movimentacoes");
  }

  get status() :AbstractControl | null {
    return this.form.get("status");
  }

  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao) {
    this.form.reset();

    if(requisicao) {
      const departamento = requisicao.departamento ? requisicao.departamento : null;
      const funcionario = requisicao.funcionario ? requisicao.funcionario : null;
      const equipamento = requisicao.equipamento ? requisicao.equipamento : null;

      const requisicaoCompleta = {
        ...requisicao,
        departamento,
        funcionario,
        equipamento
      }

      this.form.setValue(requisicaoCompleta);
    }

    try {
      await this.modalService.open(modal).result;

      if(this.form.dirty && this.form.valid) {
        if(!requisicao) {
          this.consigurarValoresPadrao();
          await this.requisicaoService.inserir(this.form.value);
        }
        else
          await this.requisicaoService.editar(this.form.value);

        this.toastr.success("Informações registradas com sucesso!", `${this.tituloModal} de requisição`);
      } else
        this.toastr.error("Verifique as informações e tente novamente.", `${this.tituloModal} de requisição`);
    } catch (error) {
      if(error != "fechar" && error != "1" && error != "0")
        this.toastr.error("Houve um erro na solicitação");
    }
  }

  public async excluir(requisicao: Requisicao) {
    try {
      await this.requisicaoService.excluir(requisicao);
      this.toastr.warning(`'${requisicao.id}' excluída`, "Exclusão de requisições");
    } catch (error) {
      this.toastr.error("Houve um erro ao excluir a requisição. Tente novamente.", "Exclusão de requisições");
    }
  }

  obterFuncionarioLogado() {
    this.processoAutenticado = this.authService.usuarioLogado
      .subscribe(dados => {
        this.funcionarioService.selecionarFuncionarioLogado(dados?.email!)
          .subscribe(funcionario => {
            this.funcionarioLogado = funcionario;
            console.log(this.funcionarioLogado);
            this.requisicoes$ =
              this.requisicaoService
                .selecionarRequisicoesDoFuncionarioAtual(this.funcionarioLogado.id);
          })
      })
  }

  private consigurarValoresPadrao(): void {
    this.form.get("dataCriacao")?.setValue(new Date(Date.now()).toLocaleString());
    const movimentacoes: Movimentacao[] = [];
    this.form.get("movimentacoes")?.setValue(movimentacoes);
    this.form.get("status")?.setValue(StatusRequisicao.Aberta);
    this.form.get("funcionarioId")?.setValue(this.funcionarioLogado.id);
  }
}

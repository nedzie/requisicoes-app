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
import { Requisicao } from '../models/requisicao.model';
import { RequisicaoService } from '../services/requisicao.service';

@Component({
  selector: 'app-requisicoes-departamento',
  templateUrl: './requisicoes-departamento.component.html'
})
export class RequisicoesDepartamentoComponent implements OnInit, OnDestroy {
  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;
  private processoAutenticado: Subscription;

  public funcionarioLogado: Funcionario;

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
      descricao: new FormControl("", [Validators.required, Validators.minLength(25)]),
      dataCriacao: new FormControl(""),

      departamentoId: new FormControl("", [Validators.required]),
      departamento: new FormControl(""),

      funcionarioId: new FormControl(""),
      funcionario: new FormControl(""),

      equipamentoId: new FormControl(""),
      equipamento: new FormControl("")
    });

    this.obterFuncionarioLogado();
  }

  ngOnDestroy(): void {
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

  obterFuncionarioLogado() {
    this.processoAutenticado = this.authService.usuarioLogado
      .subscribe(dados => {
        this.funcionarioService.selecionarFuncionarioLogado(dados?.email!)
          .subscribe(funcionario => {
            this.funcionarioLogado = funcionario;
            this.requisicoes$ =
              this.requisicaoService
                .selecionarRequisicoesDoDepartamentoAtual(funcionario.departamentoId);
          })
      })
  }
}

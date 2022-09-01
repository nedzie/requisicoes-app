import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Funcionario } from './models/funcionario.model';
import { FuncionarioService } from './services/funcionario.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Departamento } from '../departamentos/models/departamento.model';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html'
})
export class FuncionarioComponent implements OnInit {
  public funcionarios$: Observable<Funcionario[]>;
  public departamentos$: Observable<Departamento[]>;
  public form: FormGroup;

  constructor(
    private funcionarioService: FuncionarioService,
    private departamentoService: DepartamentoService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.funcionarios$ = this.funcionarioService.selecionarTodos();
    this.departamentos$ = this.departamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(""),
      nome: new FormControl(""),
      email: new FormControl(""),
      funcao: new FormControl(""),
      departamentoId: new FormControl(""),
      departamento: new FormControl("")
    });
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id() {
    return this.form.get("id");
  }

  get nome() {
    return this.form.get("nome");
  }

  get email() {
    return this.form.get("email");
  }

  get funcao() {
    return this.form.get("funcao");
  }

  get departamentoId() {
    return this.form.get("departamentoI");
  }

  public async gravar(modal: TemplateRef<any>, funcionario?: Funcionario) {
    this.form.reset();

    if(funcionario) {
      const departamento = funcionario.departamento ? funcionario.departamento : null;

      // ... = Spread Operator | Faz um splash das propriedades do objeto filho, para o objeto pai
      const funcionarioCompleto = {
        ...funcionario,
        departamento
      }

      this.form.setValue(funcionarioCompleto); /* Aqui os valores são preenchidos nos campos do form, quando as informações batem com o FORMGROUP lá de cima*/
    }

    try {
      await this.modalService.open(modal).result;

      if(!funcionario) {
        await this.funcionarioService.inserir(this.form.value);
        this.toastr.success("funcionário cadastrado com sucesso!", "Cadastro de funcionário");
      }
      else {
        await this.funcionarioService.editar(this.form.value);
        this.toastr.success("funcionário editado com sucesso!", "Edição de funcionário");
      }

    } catch (error) {
      if(error != "fechar" && error != "1" && error != "0")
        this.toastr.error("Houve um erro na solicitação");
    }
  }

  public excluir(funcionario: Funcionario) {
    this.funcionarioService.excluir(funcionario);
    this.toastr.warning(`'${funcionario.nome}' excluído`, "Exclusão de funcionário");
  }
}

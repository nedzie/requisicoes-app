import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Equipamento } from './models/equipamento.model';
import { EquipamentoService } from './services/equipamento.service';
import { ValidarData } from '../shared/date-validator/date.validator';

@Component({
  selector: 'app-equipamento',
  templateUrl: './equipamento.component.html',
  styleUrls: ['./equipamento.component.css']
})
export class EquipamentoComponent implements OnInit {
  public equipamento$: Observable<Equipamento[]>;
  public form: FormGroup;

  constructor(
    private equipamentoService: EquipamentoService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.equipamento$ = this.equipamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(""),
      numeroSerie: new FormControl("", [Validators.required, Validators.minLength(8)]),
      nome: new FormControl("", [Validators.required, Validators.minLength(3)]),
      precoAquisicao: new FormControl("", [Validators.required]),
      dataFabricacao: new FormControl("", [Validators.required, ValidarData()]) // Ver validação de data
    });
  }

  get tituloModal(): string {
    return this.id?.value ? "Edição" : "Cadastro";
  }

  get id(): AbstractControl | null {
    return this.form.get("id");
  }

  get numeroSerie(): AbstractControl | null {
    return this.form.get("numeroSerie");
  }

  get nome(): AbstractControl | null {
    return this.form.get("nome");
  }

  get precoAquisicao(): AbstractControl | null {
    return this.form.get("precoAquisicao");
  }

  get dataFabricacao(): AbstractControl | null {
    return this.form.get("dataFabricacao");
  }

  public async gravar(modal: TemplateRef<any>, equipamento?: Equipamento) {
    this.form.reset();

    /* Aqui os valores são preenchidos nos campos do form */
    if(equipamento)
      this.form.setValue(equipamento);

    try {
      await this.modalService.open(modal).result;

      if(this.form.dirty && this.form.valid) {
        if(!equipamento)
          await this.equipamentoService.inserir(this.form.value);
        else
          await this.equipamentoService.editar(this.form.value);

        this.toastr.success("Informações registradas com sucesso!", `${this.tituloModal} de equipamento`);
      }
      else
        this.toastr.error("Houve algo de errado com as informações, tente novamente!", `${this.tituloModal} de equipamento`);

    } catch (error) {
      if(error != "fechar" && error != "1" && error != "0")
        this.toastr.error("Houve um erro na solicitação");
    }
  }

  public excluir(equipamento: Equipamento) {
    this.equipamentoService.excluir(equipamento);
    this.toastr.warning(`'${equipamento.nome}' excluído`, "Exclusão de equipamento");
  }

}

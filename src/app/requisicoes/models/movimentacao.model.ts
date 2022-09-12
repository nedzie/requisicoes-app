import { Funcionario } from "src/app/funcionarios/models/funcionario.model";
import { StatusRequisicao } from "./status-requisicao";

export class Movimentacao {
  dataMovimentacao: string;
  descricao: string;

  status: StatusRequisicao;

  funcionario: Funcionario;
}

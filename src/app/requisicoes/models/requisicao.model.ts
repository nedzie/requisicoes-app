import { Departamento } from "src/app/departamentos/models/departamento.model";
import { Equipamento } from "src/app/equipamentos/models/equipamento.model";
import { Funcionario } from "src/app/funcionarios/models/funcionario.model";

export class Requisicao {
  id: string;
  descricao: string;
  dataCriacao: string;
  equipamentoId?: string | null;
  equipamento?: Equipamento;
  departamentoId: string;
  departamento?: Departamento;
  solicitanteId: string;
  solicitante?: Funcionario;
}

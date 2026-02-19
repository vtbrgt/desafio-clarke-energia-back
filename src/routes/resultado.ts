import { Router } from "express";
import { fornecedores } from "../data/fornecedores";
import { estados } from "../data/estados";
import {
  Solucao,
  FornecedorResultado,
  SolucaoResultado,
  ResultadoResponse,
} from "../types/types";

const router = Router();

// GET /resultado?uf=SP&consumo=30000
// Calcula economia por solução e fornecedor para o estado e consumo informados
router.get("/", (req, res) => {
  const { uf, consumo } = req.query;

  if (!uf || typeof uf !== "string") {
    res.status(400).json({ error: "O parâmetro 'uf' é obrigatório." });
    return;
  }

  if (!consumo || typeof consumo !== "string") {
    res.status(400).json({ error: "O parâmetro 'consumo' é obrigatório." });
    return;
  }

  const ufUpper = uf.toUpperCase();
  const consumoKwh = Number(consumo);

  if (isNaN(consumoKwh) || consumoKwh <= 0) {
    res.status(400).json({ error: "O parâmetro 'consumo' deve ser um número maior que zero." });
    return;
  }

  const estado = estados.find((e) => e.uf === ufUpper);
  if (!estado) {
    res.status(404).json({ error: `Estado '${ufUpper}' não encontrado.` });
    return;
  }

  const { tarifaBase } = estado;
  const custo_base_mensal = consumoKwh * tarifaBase;

  const disponiveis = fornecedores.filter((f) => f.estados.includes(ufUpper));

  const tiposSolucao: Solucao[] = ["GD", "ML"];

  const solucoes: SolucaoResultado[] = tiposSolucao
    .map((tipo) => {
      const fornecedoresDaTipo = disponiveis.filter((f) =>
        f.solucoes.includes(tipo)
      );

      if (fornecedoresDaTipo.length === 0) return null;

      const resultados: FornecedorResultado[] = fornecedoresDaTipo.map((f) => {
        const custo_kwh = (tipo === "GD" ? f.custo_kwh_gd : f.custo_kwh_ml) as number;
        const custo_mensal = consumoKwh * custo_kwh;
        const economia = custo_base_mensal - custo_mensal;
        const economia_percentual = economia / custo_base_mensal;

        return {
          fornecedor: f,
          solucao: tipo,
          custo_kwh,
          custo_mensal,
          economia,
          economia_percentual,
        };
      });

      resultados.sort((a, b) => b.economia - a.economia);

      return {
        tipo,
        fornecedores: resultados,
        melhor_economia: resultados[0].economia,
      } satisfies SolucaoResultado;
    })
    .filter((s): s is SolucaoResultado => s !== null);

  const response: ResultadoResponse = {
    uf: ufUpper,
    consumo_kwh: consumoKwh,
    tarifa_base_kwh: tarifaBase,
    custo_base_mensal,
    solucoes,
  };

  res.json(response);
});

export default router;

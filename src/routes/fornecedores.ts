import { Router } from "express";
import { fornecedores } from "../data/fornecedores";

const router = Router();

// GET /fornecedores
// Suporta filtro opcional por UF: /fornecedores?uf=SP
router.get("/", (req, res) => {
  const uf = req.query.uf as string | undefined;

  if (uf) {
    const ufUpper = uf.toUpperCase();
    const filtrados = fornecedores.filter((f) =>
      f.estados.includes(ufUpper)
    );
    res.json(filtrados);
    return;
  }

  res.json(fornecedores);
});

// GET /fornecedores/:id
// Retorna um fornecedor específico pelo id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const fornecedor = fornecedores.find((f) => f.id === id);

  if (!fornecedor) {
    res.status(404).json({ error: `Fornecedor com id '${id}' não encontrado.` });
    return;
  }

  res.json(fornecedor);
});

export default router;

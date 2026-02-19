import { Router } from "express";
import { estados } from "../data/estados";

const router = Router();

// GET /estados
// Retorna todas as UFs com suas tarifas base
router.get("/", (_req, res) => {
  res.json(estados);
});

// GET /estados/:uf
// Retorna a tarifa base de uma UF específica
router.get("/:uf", (req, res) => {
  const uf = req.params.uf.toUpperCase();
  const estado = estados.find((e) => e.uf === uf);

  if (!estado) {
    res.status(404).json({ error: `Estado '${uf}' não encontrado.` });
    return;
  }

  res.json(estado);
});

export default router;

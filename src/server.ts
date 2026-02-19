import express from "express";
import cors from "cors";
import estadosRouter from "./routes/estados";
import fornecedoresRouter from "./routes/fornecedores";
import resultadoRouter from "./routes/resultado";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin: "http://localhost:5173" })); // porta padrão do Vite
app.use(express.json());

app.use("/estados", estadosRouter);
app.use("/fornecedores", fornecedoresRouter);
app.use("/resultado", resultadoRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

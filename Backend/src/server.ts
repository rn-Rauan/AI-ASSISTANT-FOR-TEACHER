import "dotenv/config";
import fastify from "fastify";
import rateLimit from "@fastify/rate-limit";
import cors from "@fastify/cors";
import { disciplinaRoutes } from "./03-infrastructure/http/routes/Disciplina.routes";
import { unidadeRoutes } from "./03-infrastructure/http/routes/Unidade.routes";
import { sugerirTemasRoutes } from "./03-infrastructure/http/routes/Temas.routes";
import { gerarRoutes } from "./03-infrastructure/http/routes/Gerar.routes";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY não configurada!");
}

const app = fastify({ logger: true });

//Port
const PORT = 3131;

//CORS
app.register(cors,{
    origin: process.env.FRONTEND_URL || "***",
});

//Rate Limiting
app.register(rateLimit, {
    max: 20,
    timeWindow: "1 minute",
} )

//rota raiz
app.get("/", async () => {
    return { message: "API iniciada" };
});

app.register(disciplinaRoutes);

app.register(unidadeRoutes);

app.register(sugerirTemasRoutes);

app.register(gerarRoutes);

// Inicia o servidor
app.listen({ port: PORT }, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



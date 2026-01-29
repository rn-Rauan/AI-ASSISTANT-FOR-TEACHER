import "dotenv/config";
import fastify from "fastify";
import rateLimit from "@fastify/rate-limit";
import cors from "@fastify/cors";
import { disciplinaRoutes } from "./03-infrastructure/http/routes/Disciplina.routes";
import { unidadeRoutes } from "./03-infrastructure/http/routes/Unidade.routes";
import { sugerirTemasRoutes } from "./03-infrastructure/http/routes/Temas.routes";
import { gerarRoutes } from "./03-infrastructure/http/routes/Conteudos.routes";
import { slideRoutes } from "./03-infrastructure/http/routes/Slide.routes";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY não configurada!");
}

if (!process.env.RAG_API_URL) {
  throw new Error("Configure RAG_API_URL no .env");
}

const app = fastify({ logger: true });

//Port
const PORT = 3131;

//CORS
app.register(cors,{
    origin: true, // Permite todas as origens - use em desenvolvimento
    credentials: true
});

//Rate Limiting
app.register(rateLimit, {
    max: 100,
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

app.register(slideRoutes);

// Inicia o servidor
app.listen({ port: PORT, host: '0.0.0.0'}, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



import fastify from "fastify";
import cors from "@fastify/cors";

const app = fastify({ logger: true });

//Port
const PORT = 3131;

//CORS
app.register(cors,{
    origin: true,
});

//rota raiz
app.get("/", async () => {
    return { message: "API iniciada" };
});

//Iniciando Servidor
app.listen({ port: PORT }, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})


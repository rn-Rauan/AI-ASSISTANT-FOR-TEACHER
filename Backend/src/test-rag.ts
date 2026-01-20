import { ragBnccService } from "./DI/container";

async function testarRAG() {
  console.log("🧪 Testando integração com API de RAG...\n");

  try {
    const tema = "Probabilidade e estatística";
    console.log(`📝 Consultando BNCC sobre: ${tema}\n`);

    const contexto = await ragBnccService.consultarBNCC({ tema, disciplina_codigo: "MAT", ano_serie: "6_ANO" });

    console.log("✅ Resposta recebida!\n");
    console.log("=" .repeat(80));
    console.log(contexto);
    console.log("=".repeat(80));
    console.log("\n✅ Teste concluído com sucesso!");
  } catch (error) {
    console.error("\n❌ Erro ao testar RAG:");
    console.error(error);
    console.log("\n💡 Dica: Certifique-se de que a API de RAG está rodando em http://localhost:3001");
  }
}

testarRAG();

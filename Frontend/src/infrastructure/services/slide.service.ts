import api from '../http/api';

interface SlidePreviewResponse {
  id: string;
  tipo: string;
  conteudo: string;
  formato: string; // "markdown"
}

export const slideService = {
  // Fazer download do arquivo PPTX
  async downloadPPTX(conteudoId: string): Promise<Blob> {
    const response = await api.get(`/slides/${conteudoId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Obter preview do slide em formato markdown
  async getPreview(conteudoId: string): Promise<SlidePreviewResponse> {
    const response = await api.get(`/slides/${conteudoId}/preview`);
    return response.data;
  },

  // Helper para fazer download direto do PPTX no navegador
  async downloadPPTXDireto(conteudoId: string, nomeArquivo?: string): Promise<void> {
    const blob = await this.downloadPPTX(conteudoId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo || `slide-${conteudoId}.pptx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};

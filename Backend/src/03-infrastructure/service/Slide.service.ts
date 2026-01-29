import PptxGenJS from "pptxgenjs";

/**
 * Serviço para gerar apresentações de slides a partir de Markdown
 * Utiliza pptxgenjs para criar arquivos PPTX
 */
export class SlideService {
  /**
   * Converte conteúdo Markdown em uma apresentação PPTX
   * @param markdownContent Conteúdo em formato Markdown
   * @param tema Título da apresentação
   * @returns Buffer do arquivo PPTX gerado
   */
  async gerarPPTX(markdownContent: string, tema: string): Promise<Buffer> {
    const pptx = new PptxGenJS();
    
    // Configurações da apresentação
    pptx.author = "AI Assistant for Teacher";
    pptx.title = tema;
    pptx.subject = "Material Didático";
    
    // Dividir o markdown por slides (cada H1 # é um novo slide)
    const slides = this.dividirMarkdownEmSlides(markdownContent);
    
    // Slide de título (primeiro)
    if (slides.length > 0 && slides[0].titulo) {
      const slideTitle = pptx.addSlide();
      slideTitle.background = { color: "2C3E50" };
      
      slideTitle.addText(slides[0].titulo, {
        x: 0.5,
        y: "20%",
        w: "90%",
        h: 1.5,
        fontSize: 44,
        bold: true,
        color: "FFFFFF",
        align: "center",
      });
      
      if (slides[0].conteudo) {
        slideTitle.addText(slides[0].conteudo, {
          x: 0.5,
          y: "40%",
          w: "90%",
          h: 1,
          fontSize: 20,
          color: "ECF0F1",
          align: "center",
        });
      }
    }
    
    // Slides de conteúdo (restantes)
    for (let i = 1; i < slides.length; i++) {
      const slideData = slides[i];
      const slide = pptx.addSlide();
      
      // Fundo e cabeçalho
      slide.background = { color: "FFFFFF" };
      
      // Título do slide
      slide.addText(slideData.titulo || "", {
        x: 0.5,
        y: 0.5,
        w: "90%",
        h: 0.75,
        fontSize: 32,
        bold: true,
        color: "2C3E50",
      });
      
      // Linha decorativa
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.5,
        y: 1.3,
        w: 9,
        h: 0.05,
        fill: { color: "3498DB" },
      });
      
      // Conteúdo do slide
      if (slideData.conteudo) {
        const textoFormatado = this.formatarConteudo(slideData.conteudo);
        
        slide.addText(textoFormatado, {
          x: 0.5,
          y: 1.5,
          w: 9,
          h: 4,
          fontSize: 22,
          color: "34495E",
          valign: "top",
        });
      }
      
      // Rodapé
      slide.addText(`${tema} - Slide ${i + 1}/${slides.length}`, {
        x: 0.5,
        y: 6.8,
        w: "90%",
        h: 0.3,
        fontSize: 12,
        color: "95A5A6",
        align: "right",
      });
    }
    
    // Gerar o PPTX como buffer
    const pptxData = await pptx.write({ outputType: "nodebuffer" });
    return pptxData as Buffer;
  }
  
  /**
   * Divide o conteúdo Markdown em slides individuais
   * Cada # (H1) inicia um novo slide
   */
  private dividirMarkdownEmSlides(markdown: string): Array<{
    titulo: string;
    conteudo: string;
    temLista: boolean;
  }> {
    const slides: Array<{ titulo: string; conteudo: string; temLista: boolean }> = [];
    
    // Dividir por # (H1)
    const partes = markdown.split(/^# /gm).filter(p => p.trim());
    
    for (const parte of partes) {
      const linhas = parte.split('\n');
      const titulo = linhas[0].trim();
      const conteudo = linhas.slice(1).join('\n').trim();
      
      // Verificar se tem lista (bullet points)
      const temLista = conteudo.includes('\n-') || conteudo.includes('\n*');
      
      slides.push({
        titulo,
        conteudo: this.limparMarkdown(conteudo),
        temLista,
      });
    }
    
    return slides;
  }
  
  /**
   * Remove marcações Markdown e formata o texto para PPTX
   */
  private limparMarkdown(texto: string): string {
    return texto
      .replace(/^#{1,6}\s+/gm, '') // Remove headers
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.+?)\*/g, '$1') // Remove itálico
      .replace(/^[-*+]\s+/gm, '• ') // Converte listas para bullet
      .trim();
  }
  
  /**
   * Formata o conteúdo para melhor apresentação
   */
  private formatarConteudo(conteudo: string): string {
    // Limitar o tamanho do texto por slide
    const linhas = conteudo.split('\n').filter(l => l.trim());
    
    // Se tiver muitas linhas, pegar as principais
    if (linhas.length > 8) {
      return linhas.slice(0, 8).join('\n') + '\n...';
    }
    
    return linhas.join('\n');
  }
}
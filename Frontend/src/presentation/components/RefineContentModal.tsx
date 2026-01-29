import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Conteudo } from "@/domain/entities/Conteudo";
import { conteudoService } from "@/infrastructure/services/conteudo.service";
import { Loader2, Send, Check, Sparkles, MessageSquare } from "lucide-react";

interface RefineContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: Conteudo;
  onSave: (refinedContent: string) => Promise<void>;
}

interface Message {
  role: 'user' | 'system';
  text: string;
}

export function RefineContentModal({ isOpen, onClose, content, onSave }: RefineContentModalProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refinedContent, setRefinedContent] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Reset state when content changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setRefinedContent(null);
      setMessages([]);
      setPrompt("");
      setError(null);
    }
  }, [isOpen, content]);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = prompt;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setPrompt("");
    setIsLoading(true);
    setError(null);

    try {
      const result = await conteudoService.refinarPreview(content.id, userMessage);
      setRefinedContent(result.conteudo);
      setMessages(prev => [...prev, { role: 'system', text: result.mensagemIA || "Conteúdo refinado com sucesso. Verifique a prévia." }]);
    } catch (err) {
      console.error(err);
      setError("Erro ao refinar conteúdo. Tente novamente.");
      setMessages(prev => [...prev, { role: 'system', text: "Ocorreu um erro ao processar sua solicitação." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!refinedContent) return;
    try {
      setIsLoading(true);
      await onSave(refinedContent);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar alterações.");
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Simplificar a linguagem",
    "Expandir com mais detalhes",
    "Corrigir gramática e ortografia",
    "Adicionar exemplos práticos"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden sm:rounded-lg">
        <DialogHeader className="px-6 py-4 border-b bg-muted/20">
            <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Refinar Conteúdo com IA
            </DialogTitle>
            <DialogDescription>
                Converse com a IA para ajustar e melhorar o conteúdo da unidade.
            </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
            {/* Left Panel: Chat */}
            <div className="w-full md:w-1/3 border-r flex flex-col bg-muted/10 h-1/2 md:h-auto">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-muted-foreground mt-10">
                            <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">Envie instruções para refinar o conteúdo.</p>
                            <div className="mt-4 flex flex-col gap-2 px-4">
                                {suggestions.map(s => (
                                    <Button 
                                        key={s} 
                                        variant="outline" 
                                        size="sm" 
                                        className="text-xs justify-start h-auto whitespace-normal text-left"
                                        onClick={() => setPrompt(s)}
                                    >
                                        {s}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
                                msg.role === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted border'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-muted border rounded-lg p-3">
                                <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="p-2 text-xs text-red-500 bg-red-50 rounded border border-red-200">
                            {error}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 border-t bg-background">
                    <div className="flex gap-2">
                        <Textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Descreva como deseja alterar..."
                            className="min-h-[80px] resize-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                            {prompt.length}/500
                        </span>
                        <Button size="sm" onClick={handleSend} disabled={isLoading || !prompt.trim()}>
                            <Send className="w-4 h-4 mr-2" />
                            Enviar
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right Panel: Preview */}
            <div className="w-full md:w-2/3 flex flex-col bg-background h-1/2 md:h-auto border-t md:border-t-0">
                <div className="flex items-center justify-between px-6 py-2 border-b bg-muted/10 text-xs font-medium text-muted-foreground">
                    <span>PRÉVIA DO CONTEÚDO</span>
                    {refinedContent && <span className="text-green-600 flex items-center gap-1"><Check className="w-3 h-3"/> Modificado</span>}
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                        <div 
                            key={refinedContent || "original"}
                            className="whitespace-pre-wrap font-mono text-sm leading-relaxed animate-in fade-in duration-500"
                        >
                            {refinedContent || content.conteudo}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/20">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading || !refinedContent}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                Aceitar Alterações
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { unidadeService } from '../../../infrastructure/services/unidade.service';
import { conteudoService } from '../../../infrastructure/services/conteudo.service';
import type { Unidade } from '../../../domain/entities/Unidade';
import type { Conteudo } from '../../../domain/entities/Conteudo';

export const PaginaUnidade: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [unidade, setUnidade] = useState<Unidade | null>(null);
    const [conteudos, setConteudos] = useState<Conteudo[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            carregarDados(id);
        }
    }, [id]);

    const carregarDados = async (unidadeId: string) => {
        try {
            setCarregando(true);
            // Busca unidade e conteúdos em paralelo
            const [dadosUnidade, dadosConteudos] = await Promise.all([
                unidadeService.getById(unidadeId),
                conteudoService.listarPorUnidade(unidadeId)
            ]);
            setUnidade(dadosUnidade);
            setConteudos(dadosConteudos);
        } catch (error) {
            console.error('Erro ao carregar unidade:', error);
            setErro('Não foi possível carregar os detalhes da unidade.');
        } finally {
            setCarregando(false);
        }
    };

    if (carregando) return <div style={{ padding: '20px' }}>Carregando...</div>;
    if (erro) return <div style={{ padding: '20px', color: 'red' }}>{erro}</div>;
    if (!unidade) return <div style={{ padding: '20px' }}>Unidade não encontrada.</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: '#666', display: 'block', marginBottom: '10px' }}>
                &larr; Voltar para Dashboard
            </Link>
            
            <h1 style={{ marginBottom: '20px' }}>{unidade.tema}</h1>
            
            <div style={{ marginBottom: '30px' }}>
                <h3>Conteúdos Gerados</h3>
                {conteudos.length === 0 ? (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>Nenhum conteúdo gerado para esta unidade ainda.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {conteudos.map((conteudo) => (
                            <div key={conteudo.id} style={{ 
                                border: '1px solid #ddd', 
                                borderRadius: '8px', 
                                padding: '15px',
                                backgroundColor: 'white',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <span style={{ 
                                        textTransform: 'uppercase', 
                                        fontSize: '0.8rem', 
                                        fontWeight: 'bold',
                                        backgroundColor: '#e3f2fd',
                                        color: '#1565c0',
                                        padding: '4px 8px',
                                        borderRadius: '4px'
                                    }}>
                                        {conteudo.tipo.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <div style={{ 
                                    maxHeight: '200px', 
                                    overflowY: 'auto', 
                                    backgroundColor: '#f5f5f5', 
                                    padding: '10px', 
                                    borderRadius: '4px',
                                    whiteSpace: 'pre-wrap',
                                    fontFamily: 'monospace',
                                    fontSize: '0.9rem'
                                }}>
                                    {conteudo.conteudo.substring(0, 300)}
                                    {conteudo.conteudo.length > 300 && '...'}
                                </div>
                                <button style={{
                                    marginTop: '10px',
                                    background: 'none',
                                    border: '1px solid #1565c0',
                                    color: '#1565c0',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}>
                                    Ver Completo
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

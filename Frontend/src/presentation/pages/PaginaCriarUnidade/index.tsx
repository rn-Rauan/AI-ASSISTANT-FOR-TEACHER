import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { unidadeService } from '../../../infrastructure/services/unidade.service';
import { conteudoService } from '../../../infrastructure/services/conteudo.service';

export const PaginaCriarUnidade = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Recupera o ID da disciplina passado pelo state da navegação
    const disciplinaId = location.state?.disciplinaId as string;

    const [tema, setTema] = useState('');
    const [sugestoes, setSugestoes] = useState<string[]>([]);
    const [carregandoSugestoes, setCarregandoSugestoes] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    // Redireciona se tentar acessar sem disciplina selecionada
    useEffect(() => {
        if (!disciplinaId) {
            // Opcional: Poderíamos carregar um select de disciplinas aqui, 
            // mas por enquanto vamos manter o fluxo seguro redirecionando.
            // setErro("Nenhuma disciplina selecionada.");
        }
    }, [disciplinaId]);

    const handleSugerirTemas = async () => {
        if (!disciplinaId) return;
        try {
            setCarregandoSugestoes(true);
            setErro(null);
            const temasSugeridos = await conteudoService.sugerirTemas(disciplinaId);
            setSugestoes(temasSugeridos || []);
        } catch (error) {
            console.error('Erro ao sugerir temas:', error);
            setErro('Erro ao gerar sugestões. Tente novamente ou digite manualmente.');
        } finally {
            setCarregandoSugestoes(false);
        }
    };

    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tema.trim() || !disciplinaId) return;

        try {
            setSalvando(true);
            setErro(null);
            
            await unidadeService.create({
                disciplina_id: disciplinaId,
                tema: tema
            });

            // Redireciona para a página da nova unidade criada
            // ou volta para a lista de unidades
            navigate(`/disciplinas/${disciplinaId}`); 
        } catch (error) {
            console.error('Erro ao criar unidade:', error);
            setErro('Erro ao salvar unidade. Verifique o console.');
        } finally {
            setSalvando(false);
        }
    };

    if (!disciplinaId) {
        return (
            <div>
                <p>Nenhuma disciplina selecionada.</p>
                <Link to="/">Voltar para o Dashboard</Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
                <Link to={`/disciplinas/${disciplinaId}`}>← Voltar para Disciplina</Link>
            </div>

            <h1>Nova Unidade de Ensino</h1>
            <p>Defina o tema da unidade ou peça sugestões para a IA com base na BNCC.</p>

            <form onSubmit={handleSalvar} style={{ marginTop: '20px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="tema" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        Tema da Unidade:
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            id="tema"
                            value={tema}
                            onChange={(e) => setTema(e.target.value)}
                            placeholder="Ex: Frações, Revolução Francesa, Ecossistemas..."
                            style={{ flex: 1, padding: '10px', fontSize: '16px' }}
                            required
                        />
                        <button
                            type="button"
                            onClick={handleSugerirTemas}
                            disabled={carregandoSugestoes}
                            style={{
                                padding: '10px 15px',
                                backgroundColor: '#646cff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: carregandoSugestoes ? 'wait' : 'pointer',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {carregandoSugestoes ? 'Gerando...' : '✨ Sugerir com IA'}
                        </button>
                    </div>
                </div>

                {sugestoes.length > 0 && (
                    <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
                        <h4 style={{ marginTop: 0, marginBottom: '10px' }}>Sugestões da IA:</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {sugestoes.map((sugestao, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setTema(sugestao)}
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor: '#e0e0e0',
                                        border: 'none',
                                        borderRadius: '15px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    {sugestao}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {erro && <div style={{ color: 'red', marginBottom: '15px' }}>{erro}</div>}

                <button
                    type="submit"
                    disabled={salvando || !tema.trim()}
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        backgroundColor: '#2e7d32',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: (salvando || !tema.trim()) ? 'not-allowed' : 'pointer',
                        width: '100%'
                    }}
                >
                    {salvando ? 'Criando...' : 'Criar Unidade'}
                </button>
            </form>
        </div>
    );
};

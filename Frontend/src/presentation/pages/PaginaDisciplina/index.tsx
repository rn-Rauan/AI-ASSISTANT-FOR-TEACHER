import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { disciplinaService } from '../../../infrastructure/services/disciplina.service';
import { unidadeService } from '../../../infrastructure/services/unidade.service';
import type { Disciplina } from '../../../domain/entities/Disciplina';
import type { Unidade } from '../../../domain/entities/Unidade';

export const PaginaDisciplina = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [disciplina, setDisciplina] = useState<Disciplina | null>(null);
    const [unidades, setUnidades] = useState<Unidade[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            carregarDados(id);
        }
    }, [id]);

    const carregarDados = async (disciplinaId: string) => {
        try {
            setCarregando(true);
            // Busca dados da disciplina e suas unidades em paralelo
            const [dadosDisciplina, dadosUnidades] = await Promise.all([
                disciplinaService.getById(disciplinaId),
                unidadeService.listarPorDisciplina(disciplinaId)
            ]);
            
            setDisciplina(dadosDisciplina);
            setUnidades(dadosUnidades);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setErro('Erro ao carregar disciplina ou unidades.');
        } finally {
            setCarregando(false);
        }
    };

    if (carregando) return <div>Carregando...</div>;
    if (erro) return <div style={{ color: 'red' }}>{erro}</div>;
    if (!disciplina) return <div>Disciplina não encontrada.</div>;

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <Link to="/">← Voltar para Dashboard</Link>
            </div>

            <h1>{disciplina.nome || disciplina.disciplina_codigo}</h1>
            <p>{disciplina.anoSerieNome || disciplina.ano_serie}</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <h2>Unidades de Ensino</h2>
                <button 
                    onClick={() => navigate('/unidades/criar', { state: { disciplinaId: disciplina.id } })}
                    style={{ padding: '10px 20px', cursor: 'pointer' }}
                >
                    + Nova Unidade
                </button>
            </div>

            {unidades.length === 0 ? (
                <p>Nenhuma unidade cadastrada para esta disciplina.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {unidades.map((unidade) => (
                        <li key={unidade.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                            <Link to={`/unidades/${unidade.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                <h3>{unidade.tema}</h3>
                                {unidade.criadoEm && <small>Criado em: {new Date(unidade.criadoEm).toLocaleDateString()}</small>}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

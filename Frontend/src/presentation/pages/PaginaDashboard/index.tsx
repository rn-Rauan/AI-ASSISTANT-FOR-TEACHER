import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { disciplinaService } from '../../../infrastructure/services/disciplina.service';
import type { Disciplina } from '../../../domain/entities/Disciplina';

export const PaginaDashboard = () => {
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    // O useEffect deve ficar no topo para facilitar a leitura do "ciclo de vida" do componente
    useEffect(() => {
        carregarDisciplinas();
    }, []);

    const carregarDisciplinas = async () => {
        try {
            setCarregando(true);
            const dados = await disciplinaService.getAll();
            setDisciplinas(dados);
        } catch (error) {
            console.error('Erro ao buscar disciplinas:', error);
            setErro('Não foi possível carregar as disciplinas. Verifique se o backend está rodando.');
        } finally {
            setCarregando(false);
        }
    };

    if (carregando) {
        return <div>Carregando disciplinas...</div>;
    }

    if (erro) {
        return <div style={{ color: 'red' }}>{erro}</div>;
    }

    return (
        <div>
            <h1>Dashboard - Minhas Disciplinas</h1>
            
            {disciplinas.length === 0 ? (
                <p>Nenhuma disciplina encontrada.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {disciplinas.map((disciplina) => (
                        <li key={disciplina.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                            <Link to={`/disciplinas/${disciplina.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                <h3>{disciplina.nome || disciplina.disciplina_codigo}</h3>
                                <p>Série/Ano: {disciplina.anoSerieNome || disciplina.ano_serie}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

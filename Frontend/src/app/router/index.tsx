import { createBrowserRouter } from 'react-router-dom';
import { Dashboard } from '../../presentation/pages/Dashboard';
import { DetalhesDisciplina } from '../../presentation/pages/Disciplina';
import { CriarUnidade } from '../../presentation/pages/CriarUnidade';
import { CriarDisciplina } from '../../presentation/pages/CriarDisciplina';
import { DetalhesUnidade } from '../../presentation/pages/Unidade';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/disciplinas/criar',
    element: <CriarDisciplina />,
  },
  {
    path: '/disciplinas/:id',
    element: <DetalhesDisciplina />,
  },
  {
    path: '/unidades/criar',
    element: <CriarUnidade />,
  },
  {
    path: '/unidades/:id',
    element: <DetalhesUnidade />,
  },
]);

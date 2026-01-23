import { createBrowserRouter } from 'react-router-dom';
import { PaginaDashboard } from '../../presentation/pages/PaginaDashboard';
import { PaginaDisciplina } from '../../presentation/pages/PaginaDisciplina';
import { PaginaCriarUnidade } from '../../presentation/pages/PaginaCriarUnidade';
import { PaginaUnidade } from '../../presentation/pages/PaginaUnidade';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PaginaDashboard />,
  },
  {
    path: '/disciplinas/:id',
    element: <PaginaDisciplina />,
  },
  {
    path: '/unidades/criar',
    element: <PaginaCriarUnidade />,
  },
  {
    path: '/unidades/:id',
    element: <PaginaUnidade />,
  },
]);

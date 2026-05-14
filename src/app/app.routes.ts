import { Routes } from '@angular/router';

export const routes: Routes = [

  // rota inicial
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // LOGIN
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent)
  },

  // layout administrativo
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/admin-layout/admin-layout.component')
        .then(m => m.AdminLayoutComponent),

    children: [

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },

      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/usuarios/usuarios.component')
            .then(m => m.UsuariosComponent)
      },

      {
        path: 'categorias',
        loadComponent: () =>
          import('./features/categorias/categorias.component')
            .then(m => m.CategoriasComponent)
      },

      {
        path: 'produtos',
        loadComponent: () =>
          import('./features/produtos/produtos.component')
            .then(m => m.ProdutosComponent)
      },

      {
        path: 'listas',
        loadComponent: () =>
          import('./features/listas/listas.component')
            .then(m => m.ListasComponent)
      },

      {
        path: 'itens',
        loadComponent: () =>
          import('./features/itens/itens.component')
            .then(m => m.ItensComponent)
      }

    ]
  }
];
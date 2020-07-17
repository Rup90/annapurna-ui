import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';

const routes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('../app/login/login.module').then(m => m.LoginModule)
    },
    {
        path: 'registration',
        loadChildren: () => import('../app/registration/registration.module').then(m => m.RegistrationModule)
    },
    {
        path: 'user',
        loadChildren: () => import('../app/dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
        path: 'admin',
        loadChildren: () => import('../app/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
const config: ExtraOptions = {
    useHash: false,
};
@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

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
        path: 'user/home',
        loadChildren: () => import('../app/dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
        path: 'admin/home',
        loadChildren: () => import('../app/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule)
    },
    {
        path:  'admin/profile',
        loadChildren: () => import('../app/shared/components/myProfile/my-profile.module').then(m => m.MyProfileModule)
    },
    {
        path:  'user/profile',
        loadChildren: () => import('../app/shared/components/myProfile/my-profile.module').then(m => m.MyProfileModule)
    },
    {
        path:  'admin/added-items',
        loadChildren: () => import('../app/added-items/added-items.module').then(m => m.AddedItemsModule)
    },
    {
        path: 'admin/notification',
        loadChildren: () => import('../app/admin-notification/admin-notification.module').then(m => m.AdminNotificationModule)
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

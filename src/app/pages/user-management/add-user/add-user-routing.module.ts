import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddUserPage } from './add-user.page';
import { UserSalaryTypeComponent } from '../user-salary-type/user-salary-type.component';

const routes: Routes = [
  {
    path: '',
    component: AddUserPage
  },
  {
    path: '',
    component: UserSalaryTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddUserPageRoutingModule {}

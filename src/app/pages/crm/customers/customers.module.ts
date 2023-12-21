import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomersPageRoutingModule } from './customers-routing.module';

import { CustomersPage } from './customers.page';
import { SharedModule } from "src/app/components/shared.module";
import { CrmSharedModule } from '../components/crmshared.module';
import { PipeModule } from "../../../lib/pipe/pipes.module";

@NgModule({
    declarations: [CustomersPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CustomersPageRoutingModule,
        SharedModule,
        CrmSharedModule,
        PipeModule
    ]
})
export class CustomersPageModule {}

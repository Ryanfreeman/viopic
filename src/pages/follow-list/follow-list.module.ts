import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FollowListPage } from './follow-list';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    FollowListPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(FollowListPage),
  ],
})
export class FollowListPageModule {}

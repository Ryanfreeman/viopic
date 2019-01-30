import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HotTimelinePage } from './hot-timeline';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    HotTimelinePage,
  ],
  imports: [
    IonicPageModule.forChild(HotTimelinePage),
    ComponentsModule
  ],
})
export class HotTimelinePageModule {}

import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { TimelineComponent } from './timeline/timeline';
import { UserListComponent } from './user-list/user-list';
@NgModule({
	declarations: [TimelineComponent,
    UserListComponent],
	imports: [IonicModule],
	exports: [TimelineComponent,
    UserListComponent]
})
export class ComponentsModule {}

import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { HomePage } from '../home/home';
import { NavParams, Tabs, Content, Events } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { TimelineProvider } from '../../providers/timeline/timeline';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild(Content) content: Content;
  @ViewChild('mainTabs') maienTabs: Tabs;
  @ViewChild('homeBtn') homeBtn: ElementRef;

  tab1Root = HomePage;
  tab2Root = 'SearchPage';
  tab3Root = 'AddPostPage';
  tab4Root = 'NotificationsPage';
  tab5Root = 'MessagesPage';

  unreadMessages: any[] = [];
  unreadPosts: any[] = [];
  unreadNotifications: any[] = [];
  constructor(
    private chatProvider: ChatProvider,
    private timelineProvider: TimelineProvider,
    private events: Events,
    private renderer: Renderer

  ) {
    
    this.chatProvider.isUnread().subscribe(data => {
      this.unreadMessages = data;
    });

    this.timelineProvider.isPostUnread().subscribe(data => {
      this.unreadPosts = data;
    });
    this.timelineProvider.isNotificationUnread().subscribe(data => {
      this.unreadNotifications = data;
    });

  }

  scrollTop(ev) {
    console.log('TOP', ev);
    if (ev.center.x <= 65)
      this.events.publish('home:scrollToTop', Date.now());
  }


}

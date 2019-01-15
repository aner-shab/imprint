import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { HomePage } from '../home/home';
import { ExplorePage } from '../explore/explore';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  mapRoot = ExplorePage;
  profileRoot = HomePage;
  aboutRoot = AboutPage;

  constructor() {

  }
}

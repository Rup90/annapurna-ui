import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from './shared/dataservices/dataService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  title = 'annapurna-ui';
  public pageUrl;
  constructor(public router: Router, public dataServ: DataService) {
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
               if (event instanceof NavigationStart) {
                  this.pageUrl = ((event.url  === '/login') || (event.url === '/registration') || (event.url === '/')) ? null : event.url;
                  this.dataServ.saveData('PATH', this.pageUrl);
                  console.log(this.pageUrl);
              }
    });
  }
}

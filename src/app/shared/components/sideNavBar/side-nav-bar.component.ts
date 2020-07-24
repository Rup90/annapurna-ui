import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../dataservices/dataService';
import { NotificationService } from '../../dataservices/notification.service';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.css']
})
export class SideNavBarComponent implements OnInit {

  public isAdmin = false;

  constructor(private router: Router, public dataServ: DataService, public notifyServ: NotificationService) { }

  ngOnInit(): void {
    const url = this.dataServ.getData('PATH') ?  this.dataServ.getData('PATH') : this.router.url;
    this.isAdmin = url.includes('/admin');
  }

  public openNav() {
    document.getElementById('mySidenav').style.width = '250px';
  }

  public closeNav() {
    document.getElementById('mySidenav').style.width = '0';
  }

  public clickTonavigate(path) {
    document.getElementById('mySidenav').style.width = '0';
    const urlFullPath = this.router.url;
    const splitedPath = urlFullPath.split('/')[1].split('/')[0];
    this.router.navigate([`${splitedPath}/${path}`]);
  }

  public logout() {
    this.notifyServ.closeNotification();
    localStorage.removeItem('TOKEN');
    this.router.navigate(['']);
  }

}

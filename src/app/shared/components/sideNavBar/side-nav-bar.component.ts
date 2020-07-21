import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../dataservices/dataService';

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.css']
})
export class SideNavBarComponent implements OnInit {

  public url: string;
  constructor(private router: Router, public dataServ: DataService) { }

  ngOnInit(): void {
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
    console.log(splitedPath);
    this.router.navigate([`${splitedPath}/${path}`]);
  }

  public logout() {
    localStorage.removeItem('TOKEN');
    this.router.navigate(['']);
  }

}

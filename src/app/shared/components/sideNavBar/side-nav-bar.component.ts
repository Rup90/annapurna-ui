import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.css']
})
export class SideNavBarComponent implements OnInit {

  public url: string;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.url = this.router.url;
  }

  public openNav() {
    document.getElementById('mySidenav').style.width = '250px';
  }

  public closeNav() {
    document.getElementById('mySidenav').style.width = '0';
  }

  public clickTonavigate(path) {
    document.getElementById('mySidenav').style.width = '0';
    this.router.navigate([`${this.url}/${path}`]);
  }

  public logout() {
    localStorage.removeItem('TOKEN');
    this.router.navigate(['']);
  }

}

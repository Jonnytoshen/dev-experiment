import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, pluck, tap } from 'rxjs/operators';

@Component({
  selector: 'dev-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  backVisible$!: Observable<boolean>;

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.backVisible$ = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap(event => console.log(event)),
        pluck('url'),
        map(url => url !== '/' && url !== '/table-content')
      );
  }
}

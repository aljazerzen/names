import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Http, Response} from '@angular/http';
import {Name} from './name.model';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/timer';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'my-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.css'],
  animations: [
    trigger('scrollLine', [
      state('in', style({
        transform: 'translateY(0)',
        opacity: '1'
      })),
      state('out', style({
        transform: 'translateY(-200%)',
        opacity: '0'
      })),
      transition('out => in', [
        style({
          transform: 'translateY(-200%)',
        }),
        animate('250ms ease-out')
      ]),
      transition('in => out', [
        animate('250ms ease-in-out', style({
          transform: 'translateY(200%)',
          opacity: '0'
        }))
      ])
    ]),
    trigger('slide', [
      state('inactive', style({
        transform: 'translateY(-100%)',
        opacity: '0'
      })),
      state('active', style({
        transform: 'translateY(0)',
        opacity: '1'
      })),
      transition('active => inactive', animate('100ms ease-in')),
      transition('inactive => active', animate('300ms ease-out'))
    ])
  ]
})
export class NameComponent implements OnInit {

  selectedIndex: number = 0;
  newAdjective: string;
  newName: string;
  name: Name;
  inputShown: string = 'no';

  constructor(private http: Http,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => {
          return this.http
            .get('/api/' + params['name'])
            .map((res: Response) => res.json())
        }
      )
      .subscribe(name => {
        this.name = name;
        document.body.style.backgroundColor = this.name.colors.background;
      });
  }

  submit(): void {
    this.http
      .post('/api/' + this.name.name, {adjective: this.newAdjective})
      .map((res: Response) => res.json())
      .subscribe(name => {
        this.name = name;
        this.newAdjective = '';
        this.selectedIndex = name.adjectives.length - 1;
      });
  }

  go(): void {
    this.router.navigate([this.newName]);
  }

  next(): void {
    this.selectedIndex = (this.selectedIndex + 1) % this.name.adjectives.length;
  }

  toggleInput(state: string): void {
    this.inputShown = this.inputShown == state ? 'no' : state;
  }
}

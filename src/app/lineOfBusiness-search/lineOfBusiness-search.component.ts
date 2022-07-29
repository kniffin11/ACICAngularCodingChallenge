import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';

@Component({
  selector: 'app-lineOfBusiness-search',
  templateUrl: './lineOfBusiness-search.component.html',
  styleUrls: [ './lineOfBusiness-search.component.css' ]
})

export class LineOfBusinessSearchComponent implements OnInit {
  linesOfBusiness$!: Observable<LineOfBusiness[]>;
  private searchTerms = new Subject<string>();

  constructor(private lineOfBusinessService: LineOfBusinessService) {} 

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.linesOfBusiness$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.lineOfBusinessService.searchLinesOfBusiness(term)),
    );
  }
}

import { Component, OnInit } from '@angular/core';

import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';

import { RecentQuotes } from '../RecentQuotes';
import { RecentQuotesService } from '../recentQuotes.service';

@Component({
  selector: 'app-linesOfBusiness',
  templateUrl: './linesOfBusiness.component.html',
  styleUrls: ['./linesOfBusiness.component.css']
})
export class LineOfBusinessComponent implements OnInit {
  linesOfBusiness: LineOfBusiness[] = [];
  recentQuotes: RecentQuotes[] = [];

  constructor(
    private lineOfBusinessService: LineOfBusinessService,
    private recentQuotesService: RecentQuotesService
    ) { } 

  ngOnInit() {
    this.getLinesOfBusiness();
    this.getRecentQuotes();
  }

  getLinesOfBusiness(): void {
    this.lineOfBusinessService.getLinesOfBusiness()
    .subscribe((linesOfBusiness: LineOfBusiness[]) => this.linesOfBusiness = linesOfBusiness);
  }

  getRecentQuotes(): void {
    this.recentQuotesService.getRecentQuotes()
    .subscribe((recentQuotes: RecentQuotes[]) => this.recentQuotes = recentQuotes)
  }

  getQuotesForLineOfBusiness(id: number): number{
    return this.recentQuotes.filter(quote => quote.lineOfBusiness === id).length
}

  add(name: string, description: string): void {
    name = name.trim();
    if (!name) { return; }
    this.lineOfBusinessService.addLineOfBusiness({ name, description } as LineOfBusiness)
      .subscribe((lineOfBusiness: LineOfBusiness) => {
        this.linesOfBusiness.push(lineOfBusiness);
      });
  }

  delete(lineOfBusiness: LineOfBusiness): void {
    this.linesOfBusiness = this.linesOfBusiness.filter(lob => lob !== lineOfBusiness);
    this.lineOfBusinessService.deleteLineOfBusiness(lineOfBusiness.id).subscribe();
  }

}

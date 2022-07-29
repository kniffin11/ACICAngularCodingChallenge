import { Component, OnInit } from '@angular/core';
import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';
import { RecentQuotes } from '../RecentQuotes';
import { RecentQuotesService } from '../recentQuotes.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  linesOfBusiness: LineOfBusiness[] = [];
  recentQuotes: RecentQuotes[] = [];
  public mostQuoted = []; 
  
  constructor(
    private lineOfBusinessService: LineOfBusinessService,
    private recentQuotesService: RecentQuotesService
    ) { }

  ngOnInit() {
    this.getLinesOfBusiness();
    this.getRecentQuotes();
    this.getMostQuotedLinesOfBusiness();
  }

  getLinesOfBusiness(): void {
    this.lineOfBusinessService.getLinesOfBusiness()
      .subscribe((linesOfBusiness: LineOfBusiness[]) => this.linesOfBusiness = linesOfBusiness.slice(1, 4));
  }

  getMostQuotedLinesOfBusiness():void{
    // each index will be a sub array containing a key value pair of business id to number of quotes
    let arr: number[][] =[];
    // iterate through each business
      this.linesOfBusiness.forEach(business => {
        // temp arr to represent key val pairs 
        let temp = [];
        //        lineOfBusiness.id    :    numOfQuotes
        temp.push(business.id, this.getNumberOfQuotes(business.id));
        // push this sub arr into parent arr
        arr.push(temp);
      })

      // sort the array by most quotes, the value index of each line of business
      arr.sort((a,b) => b[1] - a[1]);
  }

  // get number of quotes per line of business
  getNumberOfQuotes(id: number): number{
      // filters through and returns number of times a recent quote has the line of business id
      return this.recentQuotes.filter(quote => quote.lineOfBusiness == id).length
  }

  // get recent quotes from db
  getRecentQuotes(): void {
    this.recentQuotesService.getRecentQuotes()
    .subscribe((recentQuote: RecentQuotes[]) =>  this.recentQuotes = recentQuote);
  }
}

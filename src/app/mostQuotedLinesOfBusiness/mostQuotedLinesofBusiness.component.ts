import { Component, OnInit } from '@angular/core';
import { RecentQuotesService } from '../recentQuotes.service';
import { BusinessAndQuotes } from '../BusinessAndQuotes';

@Component({
    selector: 'app-mostQuoted',
    templateUrl: './mostQuotedLinesOfBusiness.component.html',
    // styleUrls: ['./mostQuotedLinesOfBusiness.component.css'] // I didn't make any css 
})
export class MostQuotedLinesOfBusinessComponent implements OnInit {
    // this is like a foreign key table/collection, represents the lines of business sorted by quotes
    mostQuoted: BusinessAndQuotes[] = [];

    constructor(
        private recentQuotesService: RecentQuotesService
    ) { }

    // on component mount
    ngOnInit(): void {
        this.getRecentQuotes();
    }

    // get recent quotes from db
    getRecentQuotes(): void {
        this.recentQuotesService.getRecentQuotes()
            .subscribe((recentQuotes: any[]) => {
                //set the arr to the results from the service function, sort high to low, slice for 2 businesses with most quotes
                this.mostQuoted = recentQuotes.sort((a: { count: number; }, b: { count: number; }) => {return b.count - a.count}).slice(0,2);
            });
    }
}

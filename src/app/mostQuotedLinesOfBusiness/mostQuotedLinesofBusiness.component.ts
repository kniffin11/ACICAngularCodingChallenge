import { Component, OnInit } from '@angular/core';
import { RecentQuotesService } from '../recentQuotes.service';
import { BusinessAndQuotes } from '../BusinessAndQuotes';
import { LineOfBusinessService } from '../lineOfBusiness.service';

@Component({
    selector: 'app-mostQuoted',
    templateUrl: './mostQuotedLinesOfBusiness.component.html',
    styleUrls: ['./mostQuotedLinesOfBusiness.component.css']
})
export class MostQuotedLinesOfBusinessComponent implements OnInit {
    // this is like a foreign key table/collection, represents the lines of business sorted by quotes
    mostQuoted: BusinessAndQuotes[] = [];

    constructor(
        // I wanted to recentQuotes service to getRecentQuotes, but it fails. Although when the same function is used on lineOfBusiness.service.ts, the function works correctly
        private recentQuotesService: RecentQuotesService,
        private lineOfBusinessService: LineOfBusinessService
        ) { }

    ngOnInit() {
        this.getRecentQuotes();
    }

    getRecentQuotes(): void {
        this.lineOfBusinessService.getRecentQuotes()
            .subscribe((linesOfBusiness: any[]) => {
                // set mostQuoted to the lines of business sorted by most quotes, then take the top two
                this.mostQuoted = linesOfBusiness.sort((a, b) => {return b.count - a.count}).slice(0,2);
            });
    }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';

import { RecentQuotesService } from '../recentQuotes.service';

@Component({
  selector: 'app-lineOfBusiness-detail',
  templateUrl: './lineOfBusiness-detail.component.html',
  styleUrls: [ './lineOfBusiness-detail.component.css' ]
})
export class LineOfBusinessDetailComponent implements OnInit {
  lineOfBusiness: LineOfBusiness | undefined;
  quotes: number |undefined; 

  constructor(
    private route: ActivatedRoute,
    private lineOfBusinessService: LineOfBusinessService,
    private recentQuotesService: RecentQuotesService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getLineOfBusiness();
    this.getRecentQuotes();
  }

  getLineOfBusiness(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.lineOfBusinessService.getLineOfBusiness(id)
      .subscribe((lineOfBusiness: LineOfBusiness | undefined) => this.lineOfBusiness = lineOfBusiness);
  }

  // this gets quotes connected to specific lineOfBusiness
  getRecentQuotes(): void {
    const businessId = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.recentQuotesService.getRecentQuotes()
    .subscribe((recentQuotes: any[]) => {
      this.quotes = recentQuotes.find((x: { id: number; }) => x.id == businessId).quotes;
    })
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.lineOfBusiness) {
      this.lineOfBusinessService.updateLineOfBusiness(this.lineOfBusiness)
        .subscribe(() => this.goBack());
    }
  }
}

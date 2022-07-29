import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from './message.service';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { RecentQuotes } from './RecentQuotes';
import { catchError, map, tap } from 'rxjs/operators';
import { LineOfBusiness } from './LineOfBusiness';

@Injectable({
    providedIn: 'root'
})
export class RecentQuotesService {
    private lineOfBusinessUrl = 'api/lineOfBusiness';  // URL to web api
    private recentQuotesUrl = 'api/recentQuotes';  // URL to web api

    constructor(
        private http: HttpClient,
        private messageService: MessageService) { }

    // returns all the quotes
    getRecentQuotes1(): Observable<RecentQuotes[]> {
        return this.http.get<RecentQuotes[]>(this.recentQuotesUrl).pipe(
            tap((_: any) => this.log("fetched recent quotes")),
            catchError(this.handleError<RecentQuotes[]>('getRecentQuotes'))
        )
    }




    // I tried using joinFork and combineLatest, though they are deprecated and after spending a while messing with this app to learn some of anglulars syntax, and through sites like stack overflow and a few different documentions, I realized I should probably just explain my approach and talk with you. I  want to create a one to many relationship - I have done so with a non relational DB in MERN before, it should be similar, but I don't know the syntax or several functions in angular and the inMemoryDataDB. 

    // I found some code online that was complex and had little explanation but worked, although I didn't make it myself, nor understand it the best so I thought to be transpearant I would show you my shortcomings.
    getRecentQuotes(): Observable<any[]> {
        // return combineLatest([this.http.get<LineOfBusiness[]>(this.lineOfBusinessUrl), this.http.get<RecentQuotes[]>(this.recentQuotesUrl)]) // my attempts at this were similar to that of forkJoin
        let LOB: Observable<any> = this.http.get<LineOfBusiness[]>(this.lineOfBusinessUrl);
        let RQ: Observable<any> = this.http.get<RecentQuotes[]>(this.recentQuotesUrl);

        // Code within mostQuotedLinesOfBusiness.component.ts contains the process for parsing of this data
        return forkJoin(LOB, RQ);
    }


    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
    private log(message: string) {
        this.messageService.add(`RecentQuotesService: ${message}`);
    }
}
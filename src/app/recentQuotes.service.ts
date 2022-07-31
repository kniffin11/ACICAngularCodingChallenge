import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { LineOfBusiness } from './LineOfBusiness';
import { RecentQuotes } from './RecentQuotes';
import { BusinessAndQuotes } from './BusinessAndQuotes';

@Injectable({ providedIn: 'root' })
export class RecentQuotesService {
    private lineOfBusinessUrl = 'api/lineOfBusiness';  // URL to web api
    private recentQuotesUrl = 'api/recentQuotes';  // URL to web api

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private http: HttpClient,
        private messageService: MessageService) { }

    // returns all the quotes
    getAllRecentQuotes(): Observable<RecentQuotes[]> {
        return this.http.get<RecentQuotes[]>(this.recentQuotesUrl)
        .pipe(
            tap((_: any) => this.log("fetched recent quotes")),
            catchError(this.handleError<RecentQuotes[]>('getRecentQuotes'))
        )
    }

    // to be clear, I didn't make this code, I found it online but I read through it and understand what each part does
    getRecentQuotes(): Observable<any[]> {
    // Combine the two collections, LineOfBusiness and BusinessAndQuotes
    return combineLatest([this.http.get<LineOfBusiness[]>(this.lineOfBusinessUrl), this.http.get<BusinessAndQuotes[]>(this.recentQuotesUrl)])
        .pipe(
            // to find the acting foreign key on the recentQuotes table and connect it with linesOfBusiness
            map((data: any[]) => {
                let sum = data[1].map((itm: any) => ({
                    ...data[0].find((line: any) => (itm.lineOfBusiness === line.id) && line),
                    ...itm
                }));;
                let group = sum.reduce((a: any, b: any) => {
                    let name = b.name;
                    if (!a.hasOwnProperty(name)) {
                        a[name] = 0;
                    }
                    a[name]++;
                    return a;
                }, {});
                let count = Object.keys(group).map((k: any) => {
                    return { name: k, count: group[k], id: 0 };
                });
                let another = data[0].map((k: any) => {
                    return { id: k.id };
                });
                count.forEach((item, i) => {
                    item.id = another[i].id;
                });
                return count;
            }),
            tap(_ => this.log('fetched recentQuotes')),
            catchError(this.handleError<any[]>('recentQuotes', []))
        );
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
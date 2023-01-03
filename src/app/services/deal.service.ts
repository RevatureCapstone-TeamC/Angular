import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Deal, Deal2 } from '../models/deal';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DealService {

  url: string = `${environment.baseUrl}/api/Deal`;

  constructor(private http: HttpClient) { }

  public getDeals(): Observable<Deal[]> {
    return this.http.get<Deal[]>(this.url)
      .pipe(map((deals: Deal[]) => deals.map(deal => new Deal2(deal))));
  }

  public makeDeal(deal: Deal) {
    return this.http.post(this.url, deal);
  }

  public updateDeal(deal: Deal) {
    return this.http.put(this.url, deal);
  }

  public deleteDeal(id: Number) {
    return this.http.delete(this.url + '/' + id);
  }
}

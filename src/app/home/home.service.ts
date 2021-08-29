import { Injectable } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { HttpClientModule } from '@angular/common/http'
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http'
import { HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError,retry } from 'rxjs/operators';
import { Products } from "./item.modal";

@Injectable({
  providedIn: 'root'
})

export class HomeService {

  public serviceurl = "http://localhost:3000/";
  public productsurl = this.serviceurl + 'products'
  public menusurl = this.serviceurl + 'filtermenus'
 
  constructor(public http: HttpClient) {
  }

  //getting data from mockdata.json acting as our mock api
  loadProducts() : Observable<Products[]>{
    return this.http.get<Products[]>(this.productsurl)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  //getting filter menu lists
  loadFilterMenus() : Observable<any[]>{
    return this.http.get<any[]>(this.menusurl)
      .pipe(
        retry(2),
        catchError(this.handleError)
      ); 
  }

  //add new item
  addnewProduct(newProduct:Products): Observable<any>{
    const headers = { 'content-type': 'application/json'} 
    const body=JSON.stringify(newProduct);
    return this.http.post(this.productsurl, body ,{'headers':headers})
    .pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  //update existing one
  updateProduct(id:any, item:any): Observable<Products> {
    const headers = { 'content-type': 'application/json'} 
    return this.http
      .put<Products>(this.productsurl + '/' + id, JSON.stringify(item), {'headers':headers})
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  deleteProduct(id:any) {
    const headers = { 'content-type': 'application/json'}
    return this.http
      .delete<Products>(this.productsurl + '/' + id, {'headers':headers})
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //window.alert(errorMessage);
    return throwError(errorMessage);
  }
}

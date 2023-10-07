import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()

export class ExtendedHttpInterceptor implements HttpInterceptor {
    constructor(
        public router: Router
    ) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		 if (request.url.includes('update-background') || request.url.includes('manualupload')) {
            request = request.clone({
                setHeaders: {
                	Authorization: `Bearer ${this.getToken()}`
                }
            });

        } else {
			request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${this.getToken()}`,
					'Content-Type': 'application/json'
				}
			});
		}

        return next.handle(request).pipe(
            tap((ev: HttpEvent<any>) => {
                if (ev instanceof HttpResponse) {

                }
            }),
            catchError(response => {

                if (response instanceof HttpErrorResponse) {

                    if (response.status === 401) {
                        this.clearToken();

                        this.router.navigate(['/authentication/login']);
                    }
                }

                return throwError(response);
            })
        );
    }

    clearToken() {
        localStorage.removeItem('currentUser');
    }

    getToken() {
        let currentUser: any = localStorage.getItem('currentUser');
        if (!currentUser) return null

        currentUser = JSON.parse(currentUser)
		if (currentUser.token) return currentUser.token;
        
        return null;
    }
}

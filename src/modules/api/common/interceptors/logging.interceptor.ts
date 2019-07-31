import { Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {
    // console.log('Before...');

    const now = Date.now();
    // tslint:disable-next-line:max-line-length
    return call$.pipe(tap(() => { console.log(`${context.getArgs()[0].method} - ${context.getArgs()[0].originalUrl} ${Date.now() - now}ms`); }));
  }
}

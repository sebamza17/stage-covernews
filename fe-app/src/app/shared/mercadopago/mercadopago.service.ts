import { environment } from '../../../environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Payment } from './Payment';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class MercadopagoService {
  public env = environment.mercadopago.sandbox ? 'test' : 'prod';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('MercadopagoService');
  }

  /*
  public createPayment(payment: Payment): Observable<Payment> {
    const payload = {
      token: payment.token,
      payment_method_id: payment.payment_method_id,
      payer: {
        email: payment.payer_email,
      },
      external_reference: payment.id,
      description: payment.description || '',
      transaction_amount: payment.amount,
      currency_id: 'ARS',
      operation_type: 'recurring_payment',
      notification_url: 'https://www.dictioz.com/subscriptions/ipn',
    };

    // return mercadopago.payment.create(payload).then(response => (response));
  }
  */
}

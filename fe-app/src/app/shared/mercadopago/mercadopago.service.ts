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

  getPaymentStatus({ status, status_detail }) {
    const statusMessages = {
      approved: {
        accredited: '¡Listo, se acreditó tu pago!',
      },
      in_process: {
        pending_contingency: 'Estamos procesando el pago.<br>En menos de una hora te enviaremos por e-mail el resultado.',
        pending_review_manual: 'Estamos procesando el pago.<br>En menos de 2 días hábiles' +
          'te diremos por e-mail si se acreditó o si necesitamos más información.',
      },
      rejected: {
        cc_rejected_bad_filled_card_number: 'Revisa el número de tarjeta.',
        cc_rejected_bad_filled_date: 'Revisa la fecha de vencimiento.',
        cc_rejected_bad_filled_other: 'Revisa los datos.',
        cc_rejected_bad_filled_security_code: 'Revisa el código de seguridad.',
        cc_rejected_blacklist: 'No pudimos procesar tu pago.',
        cc_rejected_call_for_authorize: 'Debes autorizar ante ' + $('[name=paymentMethodId] option:selected').text() +
          ' el pago de $ ' + $('#amount').val() + ' a MercadoPago',
        cc_rejected_card_disabled: 'Llama a ' + $('[name=paymentMethodId] option:selected').text() +
          ' para que active tu tarjeta.<br>El teléfono está al dorso de tu tarjeta.',
        cc_rejected_card_error: 'No pudimos procesar tu pago.',
        cc_rejected_duplicated_payment: 'Ya hiciste un pago por ese valor. <br>' +
          'Si necesitas volver a pagar usa otra tarjeta u otro medio de pago.',
        cc_rejected_high_risk: 'Tu pago fue rechazado.<br>Elige otro de los medios de pago, te recomendamos con medios en efectivo.',
        cc_rejected_insufficient_amount: 'Tu tarjeta no tiene fondos suficientes.',
        cc_rejected_invalid_installments: '' + $('[name=paymentMethodId] option:selected').text() +
          ' no procesa pagos en ' + $('#installments').val() + ' cuotas.',
        cc_rejected_max_attempts: 'Llegaste al límite de intentos permitidos.<br>Elige otra tarjeta u otro medio de pago.',
        cc_rejected_other_reason: '' + $('[name=paymentMethodId] option:selected').text() + ' no procesó el pago.',
      }
    };

    return statusMessages[status][status_detail];

  }

  getTokenError(errorCode) {
    const errors = {
      205: 'Ingresa el número de tu tarjeta.',
      208: 'Elige un mes.',
      209: 'Elige un año.',
      212: 'Ingresa tu documento.',
      213: 'Ingresa tu documento.',
      214: 'Ingresa tu documento.',
      220: 'Ingresa tu banco emisor.',
      221: 'Ingresa el nombre y apellido.',
      224: 'Ingresa el código de seguridad.',
      E301: 'Hay algo mal en ese número. Vuelve a ingresarlo.',
      E302: 'Revisa el código de seguridad.',
      316: 'Ingresa un nombre válido.',
      322: 'Revisa tu documento.',
      323: 'Revisa tu documento.',
      324: 'Revisa tu documento.',
      325: 'Revisa la fecha.',
      326: 'Revisa la fecha.',
      default: 'Revisa los datos.'
    };

    return errors[parseInt(errorCode, 10)] !== undefined ? errors[parseInt(errorCode, 10)] : errors.default;
  }
}

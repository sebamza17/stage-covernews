import * as $ from 'jquery';
import { environment } from '../../../environments/environment';
import '../../shared/mercadopago/mercadopago-client';

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

// import { MercadopagoService } from '../../shared/mercadopago/mercadopago.service';

declare const Mercadopago: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  // providers: [ MercadopagoService ],
  styleUrls: ['./checkout.component.less']
})
export class CheckoutComponent implements OnInit {
  env = environment.mercadopago.sandbox ? 'test' : 'prod';
  objectKeys = Object.keys;
  months = Array(12).fill(0).map((x, i) => {
    const str = '' + (i + 1), pad = '00';
    return pad.substring(0, pad.length - str.length) + str;
  });
  years = (() => {
    const years = {};
    const year = new Date().getFullYear();
    const maxYear = year + 10;
    for (let i = year; i <=  maxYear; i += 1) {
      years[i] = ('' + i).substr(2, 2);
    }
    return years;
  })();
  checkoutForm: FormGroup;
  payment = {
    id: 1,
    amount: 10,
    payer_name: 'APRO',
    payer_email: 'test@test.com',
    payer_identification_type: 'dni',
    payer_identification_number: '11222333',
  };

  constructor(/* private mercadopagoService: MercadopagoService, */ private formBuilder: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    this.initMP();
  }

  createForm() {
    this.checkoutForm = this.formBuilder.group({
      payer_name: ['', Validators.compose([Validators.required])],
      payer_email: ['', Validators.compose([Validators.email])],
      amount: ['', Validators.compose([Validators.required])],
      card_number: ['', Validators.compose([Validators.required])],
      card_expiration_month: ['', Validators.compose([Validators.required])],
      card_expiration_year: ['', Validators.compose([Validators.required])],
      card_security_code: ['', Validators.compose([Validators.required])],
    });
  }

  initMP() {
    Mercadopago.setPublishableKey(environment.mercadopago[this.env].publicKey);
    Mercadopago.getIdentificationTypes();
    this.addEvent(document.querySelector('input[data-checkout="cardNumber"]'), 'keyup', event => this.guessingPaymentMethod(event));
    this.addEvent(document.querySelector('input[data-checkout="cardNumber"]'), 'keyup', event => this.clearOptions(event));
    this.addEvent(document.querySelector('input[data-checkout="cardNumber"]'), 'change', event => this.guessingPaymentMethod(event));
    this.cardsHandler();
    this.setPaymentMethods();
  }

  addEvent(el, eventName, handler) {
    if (el.addEventListener) {
      el.addEventListener(eventName, handler);
    } else {
      el.attachEvent('on' + eventName, () => {
        handler.call(el);
      });
    }
  }

  getBin() {
    const cardSelector = document.querySelector('#cardId') as HTMLSelectElement;
    if (cardSelector && cardSelector[cardSelector.options.selectedIndex].value !== '-1') {
      return cardSelector[cardSelector.options.selectedIndex].getAttribute('first_six_digits');
    }
    const ccNumber = document.querySelector('input[data-checkout="cardNumber"]') as HTMLInputElement;
    return ccNumber.value.replace(/[ .-]/g, '').slice(0, 6);
  }

  clearOptions(event = null) {
    const bin = this.getBin();
    if (bin == null || bin.length === 0) {
      // $('.issuer-field').hide();
      const selectorIssuer = document.querySelector('#issuer') as HTMLSelectElement;
      let fragment = document.createDocumentFragment();
      let option = new Option('', '');

      selectorIssuer.options.length = 0;
      fragment.appendChild(option);
      selectorIssuer.appendChild(fragment);
      selectorIssuer.setAttribute('disabled', 'disabled');

      const selectorInstallments = document.querySelector('#installments') as HTMLSelectElement;
      fragment = document.createDocumentFragment();
      option = new Option('', '-1');

      selectorInstallments.options.length = 0;
      fragment.appendChild(option);
      selectorInstallments.appendChild(fragment);
      selectorInstallments.setAttribute('disabled', 'disabled');
    }
  }

  guessingPaymentMethod(event) {
    const bin = this.getBin();

    if (event.type === 'keyup') {
      if (bin != null && bin.length >= 6) {
        Mercadopago.getPaymentMethod({ bin }, (status, response) => this.setPaymentMethodInfo(status, response));
      }
    } else {
      setTimeout(function() {
        if (bin != null && bin.length >= 6) {
          Mercadopago.getPaymentMethod({ bin }, (status, response) => this.setPaymentMethodInfo(status, response));
        }
      }, 100);
    }
  }

  setPaymentMethods() {
    Mercadopago.getAllPaymentMethods((status, response) => {
      if (status === 200) {
        const selectorPaymentMethod = document.querySelector('#paymentMethodId') as HTMLSelectElement;
        selectorPaymentMethod.innerHTML = '';
        const fragment = document.createDocumentFragment();

        selectorPaymentMethod.options.length = 0;

        if (response.length > 0) {
          let option = new Option('Seleccione...', '');
          fragment.appendChild(option);
          for (let i = 0; i < response.length; i++) {
            if (response[i].payment_type_id === 'credit_card') {
              option = new Option(response[i].name, response[i].id);
              fragment.appendChild(option);
            }
          }
          selectorPaymentMethod.appendChild(fragment);
          selectorPaymentMethod.removeAttribute('disabled');
        }
      }
    });
  }

  setPaymentMethodInfo(status, response) {
    if (status === 200) {
      const form = document.querySelector('#pay') as HTMLFormElement;
      const paymentMethodId = document.querySelector('[name=paymentMethodId]') as HTMLSelectElement;

      if (paymentMethodId == null) {
        const paymentMethod = document.createElement('input');
        paymentMethod.setAttribute('name', 'paymentMethodId');
        paymentMethod.setAttribute('type', 'hidden');
        paymentMethod.setAttribute('value', response[0].id);
        form.appendChild(paymentMethod);
      } else {
        paymentMethodId.value = response[0].id;
      }

      const cardConfiguration = response[0].settings;
      const bin = this.getBin();
      const amountInput = document.querySelector('#amount') as HTMLInputElement;
      const amount = amountInput.value;

      for (let index = 0; index < cardConfiguration.length; index++) {
        if (bin.match(cardConfiguration[index].bin.pattern) != null && cardConfiguration[index].security_code.length === 0) {
          // In this case you do not need the Security code. You can hide the input.
        } else {
          // In this case you NEED the Security code. You MUST show the input.
        }
      }

      Mercadopago.getInstallments({ bin, amount }, this.setInstallmentInfo);
      Mercadopago.getIssuers(response[0].id, this.showCardIssuers);
      this.addEvent(document.querySelector('#issuer'), 'change', this.setInstallmentsByIssuerId);
    }

  }

  showCardIssuers(status, issuers) {
    $('.issuer-field').show();
    const issuersSelector = document.querySelector('#issuer') as HTMLSelectElement,
    fragment = document.createDocumentFragment();

    issuersSelector.options.length = 0;
    let option = new Option('Seleccione...', '-1');
    fragment.appendChild(option);

    for (let i = 0; i < issuers.length; i++) {
      if (issuers[i].name !== 'default') {
        option = new Option(issuers[i].name, issuers[i].id);
      } else {
        option = new Option('Otro', issuers[i].id);
      }
      fragment.appendChild(option);
    }
    issuersSelector.appendChild(fragment);
    issuersSelector.removeAttribute('disabled');
    document.querySelector('#issuer').removeAttribute('style');
  }

  setInstallmentsByIssuerId(status, response) {
    const bin = this.getBin();
    const issuerId = (document.querySelector('#issuer') as HTMLSelectElement).value;
    const amount = (document.querySelector('#amount') as HTMLInputElement).value;

    if (issuerId === '-1') {
      return;
    }

    Mercadopago.getInstallments({
      bin,
      amount,
      issuer_id: issuerId
    }, this.setInstallmentInfo);
  }

  setInstallmentInfo(status, response) {
    const selectorInstallments = document.querySelector('#installments') as HTMLSelectElement,
    fragment = document.createDocumentFragment();

    selectorInstallments.options.length = 0;

    if (response.length > 0) {
      let option = new Option('Seleccione...', '-1');
      const payerCosts = response[0].payer_costs;

      fragment.appendChild(option);
      for (let i = 0; i < payerCosts.length; i++) {
        option = new Option(payerCosts[i].recommended_message || payerCosts[i].installments, payerCosts[i].installments);
        fragment.appendChild(option);
      }
      selectorInstallments.appendChild(fragment);
      selectorInstallments.removeAttribute('disabled');
    }
  }

  cardsHandler() {
    this.clearOptions();
    const cardSelector = document.querySelector('#cardId') as HTMLSelectElement;
    const amount = (document.querySelector('#amount') as HTMLInputElement).value;

    if (cardSelector && cardSelector[cardSelector.options.selectedIndex].value !== '-1') {
      const bin = cardSelector[cardSelector.options.selectedIndex].getAttribute('first_six_digits');
      Mercadopago.getPaymentMethod({ bin }, (status, response) => this.setPaymentMethodInfo(status, response));
    }
  }

  submitForm(formData) {
    $('.wizard-confirm').attr('disabled', 'disabled');
    $('.checkout .process').show();
    const $form = document.querySelector('#pay');
    Mercadopago.createToken($form, (status, response) => this.responseHandler(formData, status, response));
    return false;
  }

  responseHandler(formData, status, response) {
    $('.alert-error').html('').hide();
    if (status !== 200 && status !== 201) {
      if (response.cause !== undefined) {
        const errors = [];
        $.each(response.cause, function(i, item) {
          errors.push(this.getTokenError(item.code));
        });
        $('.alert-error').html(errors.join('<br>')).show();
      }
      $('.wizard-confirm').removeAttr('disabled');
      $('.checkout .process').hide();
    } else {
      const form = document.querySelector('#pay');
      const card = document.createElement('input');
      card.setAttribute('name', 'token');
      card.setAttribute('type', 'hidden');
      card.setAttribute('value', response.id);
      form.appendChild(card);

      $('#cardNumber').removeAttr('name');
      $('#cardExpirationMonth').removeAttr('name');
      $('#cardExpirationYear').removeAttr('name');
      $('#securityCode').removeAttr('name');
      $('#docNumber').removeAttr('name');
      $('#docType').removeAttr('name');
      $('#cardholderName').removeAttr('name');

      /*
      this.mercadopagoService.createPayment(formData)
        .subscribe((res: any) => {
          $('.wizard-confirm').removeAttr('disabled');
          $('.checkout .process').hide();
          const payment = res.payment.response;
          if (payment.status === 'approved' || payment.status === 'in_process') {
            $('#step2 .alert-success').show().text(this.getPaymentStatus(payment.status, payment.status_detail));
            $('.step-pane').removeClass('active');
            $('#step2').addClass('active');
            setTimeout(function() {
              location.href = '/payments/index';
            }, 5000);
          } else {
            $('.alert-error').html(this.getPaymentStatus(payment.status, payment.status_detail)).show();
          }
        }, () => {
          $('.alert-error').html('Ha ocurrido un error. Intente nuevamente más tarde.').show();
          $('.wizard-confirm').removeAttr('disabled');
          $('.checkout .process').hide();
        });
      */
    }
  }

  getPaymentStatus(status, status_detail) {
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

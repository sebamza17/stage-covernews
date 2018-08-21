import * as $ from 'jquery';
import { environment } from '../../../environments/environment';
import '../../shared/mercadopago/mercadopago-client';

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MercadopagoService } from '../../shared/mercadopago/mercadopago.service';

declare const Mercadopago: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  providers: [ MercadopagoService ],
  styleUrls: ['./checkout.component.less']
})
export class CheckoutComponent implements OnInit {
  env = environment.mercadopago.sandbox ? 'test' : 'prod';
  notificationUrl = environment.mercadopago[this.env].notificationUrl;
  planId = environment.mercadopago[this.env].planId;
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
    amount: 10,
    payer_name: 'APRO',
    payer_email: 'marcos0x@gmail.com',
    payer_identification_type: 'dni',
    payer_identification_number: '11222333',
  };

  constructor(private mercadopagoSvc: MercadopagoService, private formBuilder: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    this.initMP();
  }

  createForm() {
    this.checkoutForm = this.formBuilder.group({
      payer_name: ['', Validators.compose([Validators.required])],
      payer_email: ['', Validators.compose([Validators.email])],
      payer_identification_type: ['', Validators.compose([Validators.required])],
      payer_identification_number: ['', Validators.compose([Validators.required])],
      payment_method_id: ['', Validators.compose([Validators.required])],
      amount: ['', Validators.compose([Validators.required])],
      card_number: ['', Validators.compose([Validators.required])],
      card_expiration_month: ['', Validators.compose([Validators.required])],
      card_expiration_year: ['', Validators.compose([Validators.required])],
      card_security_code: ['', Validators.compose([Validators.required])],
      issuer_id: [''],
      installments: [''],
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
    // if (cardSelector && cardSelector[cardSelector.options.selectedIndex].value !== '-1') {
    if (cardSelector && cardSelector.value !== '-1') {
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
    // $('.issuer-field').show();
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
    // $('.installments-field').show();
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

    // if (cardSelector && cardSelector[cardSelector.options.selectedIndex].value !== '-1') {
    if (cardSelector && cardSelector.value !== '-1') {
      const bin = cardSelector[cardSelector.options.selectedIndex].getAttribute('first_six_digits');
      Mercadopago.getPaymentMethod({ bin }, (status, response) => this.setPaymentMethodInfo(status, response));
    }
  }

  submitForm(formData) {
    $('.btn-submit').attr('disabled', 'disabled');
    // $('.checkout .process').show();
    const $form = document.querySelector('#pay');
    Mercadopago.createToken($form, (status, response) => this.responseHandler(formData, status, response));
    return false;
  }

  responseHandler(formData, status, response) {
    $('.alert-warning').hide();
    $('.alert-error').hide();
    if (status !== 200 && status !== 201) {
      if (response.cause !== undefined) {
        const errors = [];
        $.each(response.cause, function(i, item) {
          errors.push(this.mercadopagoSvc.getTokenError(item.code));
        });
        $('.alert-error').show().find('p').html(errors.join('<br>'));
      } else {
        $('.alert-warning').show();
      }
      $('.btn-submit').removeAttr('disabled');
      // $('.checkout .process').hide();
    } else {
      // TODO / In progress...
      formData.token = response.id;
      formData.user_id = 1;

      this.mercadopagoSvc.createPayment(formData)
        .then((res: any) => {
          $('.btn-submit').removeAttr('disabled');
          $('.checkout .process').hide();
          const payment = res.payment.response;
          if (payment.status === 'approved' || payment.status === 'in_process') {
            $('.step1').hide();
            $('.step2').show();
            setTimeout(function() {
              location.href = '/';
            }, 5000);
          } else {
            $('.alert-error').show().find('p').html(this.mercadopagoSvc.getPaymentStatus({ ...payment, ...{
              paymentMethod: $('[name=paymentMethodId] option:selected').text(),
              amount: $('#amount').val(),
              installments: $('#installments').val(),
            }}));
          }
        })
        .catch((error) => {
          $('.alert-error').show();
          $('.btn-submit').removeAttr('disabled');
          // $('.checkout .process').hide();
        });
    }
  }

}
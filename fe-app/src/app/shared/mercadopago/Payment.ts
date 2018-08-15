export interface Payment {
  id: number;
  token: string;
  payer_name: string;
  payer_email: string;
  payer_identification_type: string;
  payer_identification_number: number;
  payment_method_id: number;
  issuer_id: number;
  amount: number;
  description: string;
}

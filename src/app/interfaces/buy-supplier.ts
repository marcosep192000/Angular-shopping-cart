
export interface invoiceDetailsProviders {
  amount: number;
  price: number;
  idProduct: number;
  productName: string;
  barCode: string;
  description: string;
  salePrice: number;
  marca: String;
  iva: number;
  subTotal: number;
  totalStock: number;
}

export interface BuySupplier {
  idInvoice: string;
  dateOfEntry: string; //fecha ingreso
  dueDate: string; // fecha vencimiento
  payDay: string; // dia de pago
  provider: number; // proveedor
  paymentStatus: boolean; // estado del pago
  amount: number; // monto total  de factura
  invoiceDetailsProviders: any[];

}
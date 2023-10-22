type TransactionProps = {
  id?: string;
  order_id: string;
  price: number;
  created_at?: Date;
};

export class Transaction {
  id?: string;
  order_id: string;
  price: number;
  created_at?: Date;

  constructor(props: TransactionProps) {
    this.id = props.id;
    this.order_id = props.order_id;
    this.price = props.price;
    this.created_at = props.created_at;
  }
}

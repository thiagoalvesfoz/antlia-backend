import { BusinessRuleException } from "src/common/exceptions/business-rule.exception";

type ImageProps = {
  id?: string;
  bytes: Buffer;
  mimetype: string;
  product_id: string;
  created_at?: Date;
  updated_at?: Date;
};

export class Image {
  id: string;
  bytes: Buffer;
  mimetype: string;
  product_id: string;
  created_at?: Date;
  updated_at?: Date;

  constructor(props: ImageProps) {
    if (!props.product_id) {
      throw new BusinessRuleException(
        "Can't add an image to an unsaved product",
      );
    }

    this.id = props.id;
    this.bytes = props.bytes;
    this.mimetype = props.mimetype;
    this.product_id = props.product_id;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}

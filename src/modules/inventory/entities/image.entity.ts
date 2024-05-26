type ImageProps = {
  id?: string;
  bytes?: Buffer;
  mimetype?: string;
  created_at?: Date;
  updated_at?: Date;
};

export class Image {
  id: string;
  bytes: Buffer;
  mimetype: string;
  created_at?: Date;
  updated_at?: Date;

  constructor(props: ImageProps) {
    this.id = props.id;
    this.bytes = props.bytes;
    this.mimetype = props.mimetype;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  update({ bytes, mimetype }: { bytes: Buffer; mimetype: string }) {
    this.bytes = bytes;
    this.mimetype = mimetype;
    this.updated_at = new Date();
  }
}

export class RequiredCategoryIdException extends Error {
  constructor() {
    super('category id not provided');
    this.name = 'RequiredCategoryIdException';
  }
}

export class RequiredImageIdException extends Error {
  constructor() {
    super('image id not provided');
    this.name = 'RequiredImageIdException';
  }
}

export class RequiredCategoryNameException extends Error {
  constructor() {
    super('category name not provided');
    this.name = 'RequiredCategoryNameException';
  }
}

export class RequiredProductIdException extends Error {
  constructor(msg = 'product id not provided') {
    super(msg);
    this.name = 'RequiredProductIdException';
  }
}

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Type safe object variable.
 */
//  class Param {
//   private col: string = "";
//   private val: any = null;

//   constructor(columnName: string, value: any = null) {
//     this.col = columnName;
//     this.val = value;
//   };

//   public key(): string        { return this.col; }
//   public hasValue(): boolean  { return this.val != null; }
//   public value(): any         { return this.val; }
// };

/**
 * Type safe object.
 */
// export class Properties<T> {
//   private params: Array<Param> = [];

//   constructor(args: T) {
//     Object.keys(args)
//       .forEach(([k, v]) => this.params.push(new Param(k, v || null)));
//   };

//   /**
//    * Constructs an object with non-null valued properties.
//    * @returns Object
//    */
//   public constructObject(): Object {
//     let output = {};
//     this.params.forEach(param => {
//       param.hasValue() && (output[param.key()] = param.value())
//     });
//     return output;
//   };

//   /**
//    * Constructs an object with all properties, even if they're null valued.
//    * @returns Object
//    */
//   public constructAll(): Object {
//     let output = {};
//     this.params.forEach(param => output[param.key()] = param.value());
//     return output;
//   }
// };

export default prisma;

import { Entity, Fields } from "remult";

@Entity("products", { allowApiCrud: true })
export class Product {
  @Fields.autoIncrement()
  id = 0;

  @Fields.string()
  name = "";

  @Fields.string()
  description = "";

  @Fields.number()
  price = 0;

  @Fields.string()
  category = "";

  @Fields.boolean()
  inStock = true;
}

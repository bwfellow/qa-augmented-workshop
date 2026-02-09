import { Entity, Fields } from "remult";

@Entity("contacts", { allowApiCrud: true })
export class Contact {
  @Fields.autoIncrement()
  id = 0;

  @Fields.string()
  name = "";

  @Fields.string()
  email = "";

  @Fields.string()
  phone = "";

  @Fields.string()
  company = "";
}

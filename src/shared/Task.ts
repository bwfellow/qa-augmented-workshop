import { Entity, Fields } from "remult";

@Entity("tasks", { allowApiCrud: true })
export class Task {
  @Fields.autoIncrement()
  id = 0;

  @Fields.string()
  title = "";

  @Fields.string()
  description = "";

  @Fields.boolean()
  completed = false;

  @Fields.string()
  priority: "low" | "medium" | "high" = "medium";

  @Fields.createdAt()
  createdAt?: Date;
}

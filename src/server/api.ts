import { remultExpress } from "remult/remult-express";
import { SqlDatabase } from "remult";
import { BetterSqlite3DataProvider } from "remult/remult-better-sqlite3";
import Database from "better-sqlite3";
import { Task } from "../shared/Task";
import { Contact } from "../shared/Contact";
import { Product } from "../shared/Product";

export const api = remultExpress({
  dataProvider: new SqlDatabase(
    new BetterSqlite3DataProvider(new Database("mydb.sqlite"))
  ),
  entities: [Task, Contact, Product],
  initApi: async (remult) => {
    const productRepo = remult.repo(Product);
    if ((await productRepo.count()) === 0) {
      await productRepo.insert([
        {
          name: "Wireless Mouse",
          description: "Ergonomic wireless mouse with USB receiver",
          price: 29.99,
          category: "Electronics",
          inStock: true,
        },
        {
          name: "Mechanical Keyboard",
          description: "RGB mechanical keyboard with Cherry MX switches",
          price: 89.99,
          category: "Electronics",
          inStock: true,
        },
        {
          name: "USB-C Hub",
          description: "7-in-1 USB-C hub with HDMI output",
          price: 45.99,
          category: "Electronics",
          inStock: false,
        },
        {
          name: "Notebook",
          description: "Hardcover lined notebook, 200 pages",
          price: 12.99,
          category: "Office Supplies",
          inStock: true,
        },
        {
          name: "Desk Lamp",
          description: "LED desk lamp with adjustable brightness",
          price: 34.99,
          category: "Office Supplies",
          inStock: true,
        },
        {
          name: "Webcam HD",
          description: "1080p HD webcam with built-in microphone",
          price: 59.99,
          category: "Electronics",
          inStock: true,
        },
        {
          name: "Standing Desk Mat",
          description: "Anti-fatigue standing desk mat",
          price: 39.99,
          category: "Furniture",
          inStock: true,
        },
        {
          name: "Monitor Stand",
          description: "Adjustable monitor stand with storage drawer",
          price: 49.99,
          category: "Furniture",
          inStock: false,
        },
        {
          name: "Wireless Charger",
          description: "Fast wireless charging pad for phones",
          price: 19.99,
          category: "Electronics",
          inStock: true,
        },
        {
          name: "Pen Set",
          description: "Premium ballpoint pen set, pack of 5",
          price: 8.99,
          category: "Office Supplies",
          inStock: true,
        },
      ]);
    }
  },
});

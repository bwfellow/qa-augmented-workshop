import { useState } from "react";
import { remult } from "remult";
import { TasksPage } from "./pages/TasksPage";
import { ContactsPage } from "./pages/ContactsPage";
import { ProductsPage } from "./pages/ProductsPage";
import "./App.css";

remult.apiClient.url = "/api";

type Page = "tasks" | "contacts" | "products";

function App() {
  const [page, setPage] = useState<Page>("tasks");

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">QA Workshop</div>
        <div className="nav-links">
          <button
            className={page === "tasks" ? "active" : ""}
            onClick={() => setPage("tasks")}
          >
            Tasks
          </button>
          <button
            className={page === "contacts" ? "active" : ""}
            onClick={() => setPage("contacts")}
          >
            Contacts
          </button>
          <button
            className={page === "products" ? "active" : ""}
            onClick={() => setPage("products")}
          >
            Products
          </button>
        </div>
      </nav>
      <main className="main-content">
        {page === "tasks" && <TasksPage />}
        {page === "contacts" && <ContactsPage />}
        {page === "products" && <ProductsPage />}
      </main>
    </div>
  );
}

export default App;

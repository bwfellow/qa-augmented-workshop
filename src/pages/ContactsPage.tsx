import { useEffect, useState } from "react";
import { remult } from "remult";
import { Contact } from "../shared/Contact";

export function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const contactRepo = remult.repo(Contact);

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    const result = await contactRepo.find({ orderBy: { name: "asc" } });
    setContacts(result);
  }

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingId !== null) {
      const contact = contacts.find((c) => c.id === editingId);
      if (contact) {
        await contactRepo.save({ ...contact, ...formData });
      }
    } else {
      await contactRepo.insert(formData);
    }
    resetForm();
    await loadContacts();
  }

  function resetForm() {
    setFormData({ name: "", email: "", phone: "", company: "" });
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(contact: Contact) {
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
    });
    setEditingId(contact.id);
    setShowForm(true);
  }

  async function deleteContact(id: number) {
    if (!confirm("Are you sure you want to delete this contact?")) return;
    await contactRepo.delete(id);
    await loadContacts();
  }

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <h2>Contacts</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (showForm && editingId === null) {
              resetForm();
            } else {
              setEditingId(null);
              setFormData({ name: "", email: "", phone: "", company: "" });
              setErrors({});
              setShowForm(true);
            }
          }}
        >
          {showForm && editingId === null ? "Cancel" : "Add Contact"}
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit}>
          <h3>{editingId !== null ? "Edit Contact" : "New Contact"}</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contact-name">Name *</label>
              <input
                id="contact-name"
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="contact-email">Email *</label>
              <input
                id="contact-email"
                type="text"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contact-phone">Phone</label>
              <input
                id="contact-phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-company">Company</label>
              <input
                id="contact-company"
                type="text"
                placeholder="Company name"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId !== null ? "Update Contact" : "Add Contact"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <span className="result-count">
          {filteredContacts.length} contact
          {filteredContacts.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.length === 0 && (
              <tr>
                <td colSpan={5} className="empty-state">
                  {contacts.length === 0
                    ? "No contacts yet. Add one above!"
                    : "No contacts match your search."}
                </td>
              </tr>
            )}
            {filteredContacts.map((contact) => (
              <tr key={contact.id}>
                <td className="cell-primary">{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.phone || "\u2014"}</td>
                <td>{contact.company || "\u2014"}</td>
                <td>
                  <div className="table-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => startEdit(contact)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteContact(contact.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

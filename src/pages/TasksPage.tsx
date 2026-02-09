import { useEffect, useState } from "react";
import { remult } from "remult";
import { Task } from "../shared/Task";

type Filter = "all" | "active" | "completed";

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">(
    "medium"
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">(
    "medium"
  );

  const taskRepo = remult.repo(Task);

  useEffect(() => {
    loadTasks();
  }, [filter]);

  async function loadTasks() {
    const where: { completed?: boolean } = {};
    if (filter === "active") where.completed = false;
    if (filter === "completed") where.completed = true;
    const result = await taskRepo.find({
      where,
      orderBy: { createdAt: "desc" },
    });
    setTasks(result);
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await taskRepo.insert({
      title: newTitle.trim(),
      description: newDescription.trim(),
      priority: newPriority,
    });
    setNewTitle("");
    setNewDescription("");
    setNewPriority("medium");
    await loadTasks();
  }

  async function toggleComplete(task: Task) {
    await taskRepo.save({ ...task, completed: !task.completed });
    await loadTasks();
  }

  async function deleteTask(id: number) {
    await taskRepo.delete(id);
    await loadTasks();
  }

  function startEdit(task: Task) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
  }

  async function saveEdit(task: Task) {
    await taskRepo.save({
      ...task,
      title: editTitle.trim(),
      description: editDescription.trim(),
      priority: editPriority,
    });
    setEditingId(null);
    await loadTasks();
  }

  function cancelEdit() {
    setEditingId(null);
  }

  const activeCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Tasks</h2>
        <span className="badge">{activeCount} remaining</span>
      </div>

      <form className="form-card" onSubmit={addTask}>
        <h3>Add New Task</h3>
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label htmlFor="task-title">Title</label>
            <input
              id="task-title"
              type="text"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              value={newPriority}
              onChange={(e) =>
                setNewPriority(e.target.value as "low" | "medium" | "high")
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            placeholder="Add details..."
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={2}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Task
        </button>
      </form>

      <div className="filter-bar">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === "active" ? "active" : ""}`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <div className="task-list">
        {tasks.length === 0 && (
          <p className="empty-state">
            {filter === "all"
              ? "No tasks yet. Add one above!"
              : `No ${filter} tasks.`}
          </p>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-item ${task.completed ? "completed" : ""}`}
          >
            {editingId === task.id ? (
              <div className="task-edit">
                <div className="form-row">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    autoFocus
                  />
                  <select
                    value={editPriority}
                    onChange={(e) =>
                      setEditPriority(
                        e.target.value as "low" | "medium" | "high"
                      )
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={2}
                />
                <div className="task-edit-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => saveEdit(task)}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="task-content">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task)}
                    aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
                  />
                  <div className="task-details">
                    <span className="task-title">{task.title}</span>
                    {task.description && (
                      <span className="task-description">
                        {task.description}
                      </span>
                    )}
                  </div>
                  <span className={`priority-badge priority-${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="task-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => startEdit(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import "./App.css";
import { Dexie } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";

const db = new Dexie("todoApp");
db.version(1).stores({
  todos: "++id,task,completed,date",
});

const { todos } = db;

const addTask = async (event) => {
  event.preventDefault();
  const taskField = document.querySelector("#taskInput");

  await todos.add({
    task: taskField["value"],
    completed: false,
  });

  taskField["value"] = "";
  console.log("==>", taskField.nodeValue);
};

const deleteTask = (async(id) => todos.delete(id));

const toggleStatus = async (id,event)=> {
  await todos.update(id,{completed:!!event.target.checked})
}

const App = () => {
  const allItems = useLiveQuery(() => todos.toArray(), []);
  console.log("====>", allItems);
  return (
    <div className="container">
      <h3 className="teal-text center-align">Todo App</h3>
      <form className="add-item-form" onSubmit={addTask}>
        <input
          id="taskInput"
          type="text"
          className="itemField"
          placeholder="What do you want to do today?"
          required
        />
        <button type="submit" className="waves-effect btn teal right">
          Add
        </button>
      </form>

      <div className="card white darken-1">
        {allItems?.map((item) => (
          <div className="card-content" >
            <div className="row" key={item.id}>
              <p className="col s10">
                <label>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    className="checkbox-blue"
                    onChange={(event)=>toggleStatus(item.id,event)}
                  />
                  <span className="black-tex strike-text">
                    {item.task}
                  </span>
                </label>
              </p>
              <i className="col s2 material-icons delete-button" onClick={()=>deleteTask(item.id)}>delete</i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

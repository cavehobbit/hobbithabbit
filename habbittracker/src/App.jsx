import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const SAMPLE_TASKS = [
  { id: '1', title: 'Finish project assignment', priority: 'high', status: 'todo' },
  { id: '2', title: 'Review documentation', priority: 'medium', status: 'todo' },
  { id: '3', title: 'Team meeting preparation', priority: 'medium', status: 'inProgress' },
  { id: '4', title: 'Email client updates', priority: 'low', status: 'completed' },
  { id: '5', title: 'Update portfolio', priority: 'low', status: 'completed' },
];

const PriorityBadge = ({ priority }) => {

  return (
    <span className={`priority-badge priority-${priority}`}>
      <span className="priority-dot"></span>
      {priority.toUpperCase()}
    </span>
  );
};

const TaskCard = ({ task, onDelete, onDragStart, onDragEnd, isDragging }) => {
  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
    >
      <div className="task-header">
        <PriorityBadge priority={task.priority} />
        <button 
          onClick={() => onDelete(task.id)}
          className="task-delete"
        >
          <svg fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className="task-title">
        {task.title}
      </p>

    </div>
  );
};

const LeafConfetti = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const leafArray = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2.5 + Math.random() * 1.5,
    }));
    setLeaves(leafArray);

    const timer = setTimeout(() => setLeaves([]), 4500);
    return () => clearTimeout(timer);
  }, []);

  const leaves_symbols = ['🍂', '🍁', '🌿', '🍃'];

  return (
    <>
      {leaves.map(leaf => (
        <div
          key={leaf.id}
          className="leaf-confetti"
          style={{
            left: `${leaf.left}%`,
            top: '-10vh',
            animation: `leaf-fall ${leaf.duration}s ease-in forwards`,
            animationDelay: `${leaf.delay}s`,
          }}
        >
          {leaves_symbols[Math.floor(Math.random() * leaves_symbols.length)]}
        </div>
      ))}
    </>
  );
};

const AddTaskModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({ title, priority });
      setTitle('');
      setPriority('medium');
      onClose();
    }
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        
        <div className="modal-header">
          <h2>Add New Task</h2>
          <button 
            onClick={onClose}
            className="modal-close"
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="form-input"
              autoFocus
            />
          </div>


          <div className="form-group">
            <label className="form-label">Priority</label>
            <div className="priority-buttons">
              {[
                { key: 'low', label: 'Low' },
                { key: 'medium', label: 'Medium' },
                { key: 'high', label: 'High' },
              ].map(p => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPriority(p.key)}
                  className={`priority-btn priority-btn-${p.key} ${priority === p.key ? 'selected' : ''}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-buttons">
            <button
              type="button"
              onClick={onClose}
              className="modal-btn modal-btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn-submit"
            >
              Add
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

const Column = ({ title, icon, tasks, showAddButton, onDeleteTask, onAddTask, onDragOver, onDrop, onDragStart, onDragEnd, draggedTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTask = ({ title, priority }) => {
    onAddTask(title, priority);
  };

  return (
    <div 
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, title)}
      className="column"
    >
      
      <div className="column-header">

        <div className="column-title">
          <span>{icon}</span>
          <h3>{title}</h3>
        </div>
        <span className="column-count">
          {tasks.length}
        </span>
      </div>
      
      <div className="tasks-list">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task}
            onDelete={onDeleteTask}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={draggedTask?.id === task.id}
          />
        ))}
        {tasks.length === 0 && (
          <div className="empty-state">
            Empty
          </div>
        )}
      </div>

      
      {showAddButton && (
        <div className="add-task-btn">
          <button 
            onClick={() => setIsModalOpen(true)}
          >
            <div className="add-task-content">
              <span>+</span>
              <span>ADD TASK</span>
            </div>
          </button>
          <AddTaskModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAdd={handleAddTask}
          />
        </div>
      )}
    </div>
  );
};

function App() {
  const [tasks, setTasks] = useState(SAMPLE_TASKS);
  const [showConfetti, setShowConfetti] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'inProgress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  

  const progress = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
  const allComplete = tasks.length > 0 && completedTasks.length === tasks.length;
  const today = format(new Date(), 'EEEE, MMMM d');

  useEffect(() => {

    if (allComplete && tasks.length > 0) {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [allComplete, tasks.length]);

  const handleAddTask = (title, priority) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      priority,
      status: 'todo'
    };
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, columnTitle) => {
    e.preventDefault();
    
    if (!draggedTask) return;

    let newStatus = 'todo';
    if (columnTitle === 'In Progress') newStatus = 'inProgress';
    if (columnTitle === 'Completed') newStatus = 'completed';

    setTasks(tasks.map(task => 
      task.id === draggedTask.id 
        ? { ...task, status: newStatus }
        : task
    ));
    
    setDraggedTask(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#c19a6b' }}>
      {showConfetti && <LeafConfetti />}
      
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        
        <header className="header">
          <h1>HobbitHabbit</h1>
        </header>


        
        <div className="progress-section">
          <div className="progress-header">
            <div>
              <h2>Today's Progress</h2>
              <p className="progress-date">{today}</p>
            </div>
            <div className="progress-stats">
              <div className="progress-percent">{Math.round(progress)}%</div>
              <p className="progress-count">{completedTasks.length} of {tasks.length} tasks</p>
            </div>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>


        
        <div className="board">
          <Column 
            title="To Do" 
            icon="T"
            tasks={todoTasks}
            showAddButton={true}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            draggedTask={draggedTask}
          />

          <Column
          title="In Progress"
          icon='p'
          tasks={inProgressTasks}
          showAddButton={false}
          onDeleteTask={handleDeleteTask}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          draggedTask={draggedTask}
        />

        <Column
          title="Completed"
          icon="C"
          tasks={completedTasks}
          showAddButton={false}
          onDeleteTask={handleDeleteTask}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          draggedTask={draggedTask}
        />

       </div>
    </div>
  </div>
  );

}

export default App;






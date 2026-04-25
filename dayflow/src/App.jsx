import { useState } from 'react';
import { format } from 'date-fns';

// Sample data : js tempo
const SAMPLE_TASKS = [
  { id: '1', title: 'Finish project assignment', priority: 'high', status: 'todo' },
  { id: '2', title: 'Review documentation', priority: 'medium', status: 'todo' },
  { id: '3', title: 'Team meeting preparation', priority: 'medium', status: 'inProgress' },
  { id: '4', title: 'Email client updates', priority: 'low', status: 'completed' },
  { id: '5', title: 'Update portfolio', priority: 'low', status: 'completed' },
];

// priority logic updated
const PriorityBadge = ({ priority }) => {
  const styles = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-green-100 text-green-700 border-green-200'
  };
  
  const dots = {
    high: 'bg-red-500',
    medium: 'bg-amber-500',
    low: 'bg-green-500'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border ${styles[priority]}`}>
      <span className={`w-1.5 h-1.5 ${dots[priority]}`}></span>
      {priority.toUpperCase()}
    </span>
  );
};

// tasks updated
const TaskCard = ({ task, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-move group">
      <div className="flex items-center justify-between mb-3">
        <PriorityBadge priority={task.priority} />
        <button 
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100"
        >
          <svg className="w-4 h-4 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className="text-gray-800 font-medium text-sm leading-relaxed">
        {task.title}
      </p>
    </div>
  );
};

// adding task
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border-2 border-gray-300 w-96 shadow-lg">
        
        <div className="bg-gray-100 border-b-2 border-gray-300 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Add New Task</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-primary-600 focus:ring-0"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="flex gap-3">
              {['low', 'medium', 'high'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 px-3 border-2 font-medium text-sm transition-colors ${
                    priority === p
                      ? p === 'high' 
                        ? 'bg-red-100 border-red-400 text-red-700'
                        : p === 'medium'
                        ? 'bg-amber-100 border-amber-400 text-amber-700'
                        : 'bg-green-100 border-green-400 text-green-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t-2 border-gray-300">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border-2 border-gray-300 font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-primary-600 border-2 border-primary-600 font-medium text-white hover:bg-primary-700 transition-colors"
            >
              Add Task
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

const Column = ({ title, icon, tasks, showAddButton, onDeleteTask, onAddTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTask = ({ title, priority }) => {
    onAddTask(title, priority);
  };

  return (
    <div className="bg-white border-2 border-gray-300 p-5 flex flex-col min-h-[600px] shadow-md">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-gray-300">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
            {title}
          </h3>
        </div>
        <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2.5 py-1 border border-gray-300">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task}
            onDelete={onDeleteTask}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">No tasks yet</p>
          </div>
        )}
      </div>
      
      {/* Adding Button */}
      {showAddButton && (
        <div className="mt-4 pt-4 border-t-2 border-gray-300">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 px-4 border-2 border-dashed border-gray-400 bg-white hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                Add Task
              </span>
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
  
  // Filter tasks
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'inProgress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  // Calc progress
  const progress = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
  const today = format(new Date(), 'EEEE, MMMM d');

  // Add task handler
  const handleAddTask = (title, priority) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      priority,
      status: 'todo'
    };
    setTasks([...tasks, newTask]);
  };

  // Delete task handler
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              DayFlow
            </h1>
            <p className="text-gray-600 mt-2">Plan your day with clarity</p>
          </div>
          <button className="p-2 hover:bg-gray-200 transition-colors border border-gray-300">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </header>
        
        <div className="bg-white border-2 border-gray-300 p-6 mb-8 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Today's Progress</h2>
              <p className="text-sm text-gray-600 mt-1">{today}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{Math.round(progress)}%</p>
              <p className="text-xs text-gray-600">{completedTasks.length} of {tasks.length} tasks</p>
            </div>
          </div>
          
          {/* Progress sec bar */}
          <div className="w-full bg-gray-300 h-4 border-2 border-gray-400">
            <div 
              className="bg-primary-600 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Column 
            title="To Do" 
            icon="📝"
            tasks={todoTasks}
            showAddButton={true}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
          />
          <Column 
            title="In Progress" 
            icon="⚡"
            tasks={inProgressTasks}
            showAddButton={false}
            onDeleteTask={handleDeleteTask}
          />
          <Column 
            title="Completed" 
            icon="✅"
            tasks={completedTasks}
            showAddButton={false}
            onDeleteTask={handleDeleteTask}
          />
        </div>
        
      </div>
    </div>
  );
}

export default App;
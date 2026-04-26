import { useState } from 'react';
import { format } from 'date-fns';

const SAMPLE_TASKS = [
  { id: '1', title: 'Finish project assignment', priority: 'high', status: 'todo', color: 'oak' },
  { id: '2', title: 'Review documentation', priority: 'medium', status: 'todo', color: 'pine' },
  { id: '3', title: 'Team meeting preparation', priority: 'medium', status: 'inProgress', color: 'birch' },
  { id: '4', title: 'Email client updates', priority: 'low', status: 'completed', color: 'sage' },
  { id: '5', title: 'Update portfolio', priority: 'low', status: 'completed', color: 'moss' },
];

const COLORS = {
  oak: {
    light: 'bg-amber-900',
    text: 'text-amber-100',
    accent: 'bg-amber-600',
    border: 'border-amber-700',
    button: 'hover:bg-amber-800'
  },
  pine: {
    light: 'bg-green-900',
    text: 'text-green-100',
    accent: 'bg-green-600',
    border: 'border-green-700',
    button: 'hover:bg-green-800'
  },
  birch: {
    light: 'bg-slate-800',
    text: 'text-slate-100',
    accent: 'bg-slate-600',
    border: 'border-slate-700',
    button: 'hover:bg-slate-700'
  },
  sage: {
    light: 'bg-emerald-900',
    text: 'text-emerald-100',
    accent: 'bg-emerald-600',
    border: 'border-emerald-700',
    button: 'hover:bg-emerald-800'
  },
  moss: {
    light: 'bg-lime-900',
    text: 'text-lime-100',
    accent: 'bg-lime-600',
    border: 'border-lime-700',
    button: 'hover:bg-lime-800'
  },
};

const PriorityBadge = ({ priority }) => {
  const styles = {
    high: 'bg-red-900 text-red-100 border-red-700',
    medium: 'bg-yellow-900 text-yellow-100 border-yellow-700',
    low: 'bg-green-900 text-green-100 border-green-700'
  };
  
  const dots = {
    high: 'bg-red-400',
    medium: 'bg-yellow-400',
    low: 'bg-green-400'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold border-2 ${styles[priority]}`}>
      <span className={`w-2 h-2 ${dots[priority]}`}></span>
      {priority.toUpperCase()}
    </span>
  );
};
//tasks
const TaskCard = ({ task, onDelete }) => {
  const color = COLORS[task.color] || COLORS.oak;
  
  return (
    <div className={`${color.light} border-2 ${color.border} p-4 hover:shadow-lg transition-all duration-200 cursor-move group`}>
      <div className="flex items-center justify-between mb-3">
        <PriorityBadge priority={task.priority} />
        <button 
          onClick={() => onDelete(task.id)}
          className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 ${color.button}`}
        >
          <svg className={`w-4 h-4 ${color.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className={`${color.text} font-bold text-sm leading-relaxed`}>
        {task.title}
      </p>
    </div>
  );
};
//adding more tasks
const AddTaskModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [color, setColor] = useState('oak');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({ title, priority, color });
      setTitle('');
      setPriority('medium');
      setColor('oak');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-forest-100 border-4 border-forest-700 w-96 shadow-2xl">
        
        <div className="bg-forest-700 border-b-4 border-forest-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Add New Task</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-forest-600 transition-colors text-white font-bold text-xl"
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-forest-100">
          
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full px-3 py-2 border-3 border-forest-600 focus:outline-none focus:border-forest-400 focus:ring-0 bg-forest-50 text-forest-900 font-medium"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Priority
            </label>
            <div className="flex gap-3">
              {[
                { key: 'low', label: 'Low', bg: 'bg-green-700', text: 'text-green-100' },
                { key: 'medium', label: 'Medium', bg: 'bg-yellow-700', text: 'text-yellow-100' },
                { key: 'high', label: 'High', bg: 'bg-red-700', text: 'text-red-100' },
              ].map(p => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPriority(p.key)}
                  className={`flex-1 py-2 px-3 border-3 font-bold text-sm transition-all ${
                    priority === p.key
                      ? `${p.bg} ${p.text} border-white shadow-lg`
                      : `bg-forest-200 border-forest-600 text-forest-900 hover:${p.bg}`
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {Object.entries(COLORS).map(([colorKey, colorVal]) => (
                <button
                  key={colorKey}
                  type="button"
                  onClick={() => setColor(colorKey)}
                  className={`w-10 h-10 border-3 transition-all ${
                    color === colorKey
                      ? `${colorVal.accent} border-white shadow-lg`
                      : `${colorVal.light} border-forest-600`
                  }`}
                  title={colorKey}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t-4 border-forest-600">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border-3 border-forest-600 font-bold text-white hover:bg-forest-200 transition-colors bg-forest-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-forest-700 border-3 border-forest-800 font-bold text-white hover:bg-forest-600 transition-colors"
            >
              Add
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

const Column = ({ title, icon, tasks, showAddButton, onDeleteTask, onAddTask, bgColor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTask = ({ title, priority, color }) => {
    onAddTask(title, priority, color);
  };

  return (
    <div className={`${bgColor} border-4 border-forest-700 p-5 flex flex-col min-h-[600px] shadow-lg`}>
      
      <div className="flex items-center justify-between mb-4 pb-4 border-b-4 border-forest-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h3 className="font-black text-white text-sm uppercase tracking-widest">
            {title}
          </h3>
        </div>
        <span className="bg-forest-700 text-white text-xs font-black px-3 py-1 border-2 border-forest-600">
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
          <div className="text-center py-12 text-forest-500">
            <p className="text-sm font-bold">Empty</p>
          </div>
        )}
      </div>
      
      {showAddButton && (
        <div className="mt-4 pt-4 border-t-4 border-forest-700">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 px-4 border-4 border-dashed border-forest-600 bg-forest-200 hover:bg-forest-300 transition-colors font-bold text-forest-900 hover:shadow-lg"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">+</span>
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
  //todo n progress
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'inProgress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  const progress = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
  const today = format(new Date(), 'EEEE, MMMM d');

  const handleAddTask = (title, priority, color) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      priority,
      color: color || 'oak',
      status: 'todo'
    };
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-forest-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <header className="flex items-center justify-between mb-8 bg-forest-700 border-4 border-forest-600 p-6 shadow-xl">
          <div>
            <h1 className="text-5xl font-black text-white">
              DayFlow
            </h1>
            <p className="text-forest-300 mt-2 font-bold">Plan your day with clarity</p>
          </div>
          <button className="p-3 hover:bg-forest-600 transition-colors border-3 border-forest-600 bg-forest-600 font-bold text-2xl text-white">
            U
          </button>
        </header>
        
        <div className="bg-forest-700 border-4 border-forest-600 p-6 mb-8 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-white">Today's Progress</h2>
              <p className="text-sm text-forest-300 mt-1 font-bold">{today}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-forest-300">{Math.round(progress)}%</p>
              <p className="text-xs text-forest-300 font-bold">{completedTasks.length} of {tasks.length} tasks</p>
            </div>
          </div>
          
          <div className="w-full bg-forest-600 h-6 border-3 border-forest-500">
            <div 
              className="bg-forest-400 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Column 
            title="To Do" 
            icon="T"
            tasks={todoTasks}
            showAddButton={true}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            bgColor="bg-forest-700"
          />
          <Column 
            title="In Progress" 
            icon="P"
            tasks={inProgressTasks}
            showAddButton={false}
            onDeleteTask={handleDeleteTask}
            bgColor="bg-forest-700"
          />
          <Column 
            title="Completed" 
            icon="C"
            tasks={completedTasks}
            showAddButton={false}
            onDeleteTask={handleDeleteTask}
            bgColor="bg-forest-700"
          />
        </div>
        
      </div>
    </div>
  );
}

export default App;
import { useState } from 'react';
import { format } from 'date-fns';

// Sample data
const SAMPLE_TASKS = [
  { id: '1', title: 'Finish project assignment', priority: 'high', status: 'todo' },
  { id: '2', title: 'Review documentation', priority: 'medium', status: 'todo' },
  { id: '3', title: 'Team meeting preparation', priority: 'medium', status: 'inProgress' },
  { id: '4', title: 'Email client updates', priority: 'low', status: 'completed' },
  { id: '5', title: 'Update portfolio', priority: 'low', status: 'completed' },
];

// ============================================
// PRIORITY BADGE COMPONENT
// ============================================
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
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${styles[priority]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[priority]}`}></span>
      {priority.toUpperCase()}
    </span>
  );
};

// ============================================
// TASK CARD COMPONENT
// ============================================
const TaskCard = ({ task }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-move group">
      <div className="flex items-center justify-between mb-3">
        <PriorityBadge priority={task.priority} />
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
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

// ============================================
// COLUMN COMPONENT
// ============================================
const Column = ({ title, icon, tasks, showAddButton }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col min-h-[600px]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
            {title}
          </h3>
        </div>
        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      {/* Tasks */}
      <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">No tasks yet</p>
          </div>
        )}
      </div>
      
      {/* Add Button */}
      {showAddButton && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all group">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium text-gray-500 group-hover:text-primary-600 transition-colors">
                Add Task
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
  const [tasks] = useState(SAMPLE_TASKS);
  
  // Filter tasks
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'inProgress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  // Calculate progress
  const progress = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
  const today = format(new Date(), 'EEEE, MMMM d');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              DayFlow
            </h1>
            <p className="text-gray-500 mt-2">Plan your day with clarity</p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </header>
        
        {/* ============================================ */}
        {/* PROGRESS SECTION */}
        {/* ============================================ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Today's Progress</h2>
              <p className="text-sm text-gray-500 mt-1">{today}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600">{Math.round(progress)}%</p>
              <p className="text-xs text-gray-500">{completedTasks.length} of {tasks.length} tasks</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* ============================================ */}
        {/* BOARD COLUMNS */}
        {/* ============================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Column 
            title="To Do" 
            tasks={todoTasks}
            showAddButton={true}
          />
          <Column 
            title="In Progress" 
            tasks={inProgressTasks}
            showAddButton={false}
          />
          <Column 
            title="Completed" 
            tasks={completedTasks}
            showAddButton={false}
          />
        </div>
        
      </div>
    </div>
  );
}

export default App;
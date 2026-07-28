import React from 'react';
import { motion } from 'framer-motion';
import { TodoSummaryStats } from '../types/todo';

interface StatsSummaryProps {
  stats: TodoSummaryStats | null;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ stats }) => {
  if (!stats) return null;

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="mb-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {/* Total Todos Card */}
        <motion.div variants={itemVariants} className="card p-6 bg-card border border-borderBase rounded-xl shadow-sm">
          <div className="text-xs text-textMuted font-bold uppercase tracking-wider mb-2">
            Total Tasks
          </div>
          <div className="text-4xl font-extrabold tracking-tight text-textMain">{stats.total}</div>
          <div className="text-xs text-textMuted mt-1 font-medium">
            All registered items
          </div>
        </motion.div>

        {/* Completed Card */}
        <motion.div variants={itemVariants} className="card p-6 bg-card border border-borderBase rounded-xl shadow-sm">
          <div className="text-xs text-textMuted font-bold uppercase tracking-wider mb-2">
            Completed
          </div>
          <div className="text-4xl font-extrabold tracking-tight text-emerald-400">{stats.completed}</div>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 h-1.5 bg-input rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-emerald-400 rounded-full"
              />
            </div>
            <span className="text-xs text-emerald-400 font-bold">{completionRate}%</span>
          </div>
        </motion.div>

        {/* Active Card */}
        <motion.div variants={itemVariants} className="card p-6 bg-card border border-borderBase rounded-xl shadow-sm">
          <div className="text-xs text-textMuted font-bold uppercase tracking-wider mb-2">
            Active Tasks
          </div>
          <div className="text-4xl font-extrabold tracking-tight text-blue-400">
            {stats.pending + stats.inProgress}
          </div>
          <div className="text-xs text-textMuted mt-1 font-medium">
            {stats.inProgress} in progress, {stats.pending} pending
          </div>
        </motion.div>

        {/* Overdue Card */}
        <motion.div variants={itemVariants} className="card p-6 bg-card border border-borderBase rounded-xl shadow-sm">
          <div className="text-xs text-textMuted font-bold uppercase tracking-wider mb-2">
            Overdue
          </div>
          <div className="text-4xl font-extrabold tracking-tight text-rose-400">{stats.overdue}</div>
          <div className="text-xs text-textMuted mt-1 font-medium">
            Past target deadline
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

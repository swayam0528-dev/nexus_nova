import React from 'react';
import { Package, Calendar, CheckCircle, Clock, FileText } from 'lucide-react';
import { Order } from '../types';
import { motion } from 'motion/react';

interface OrderCardProps {
  order: Order;
}

const statusColors = {
  'Received': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'In Review': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  'Accepted': 'bg-green-500/10 text-green-400 border-green-500/30',
};

export function OrderCard({ order }: OrderCardProps) {
  const latestQualityNote = order.qualityNotes.length > 0
    ? order.qualityNotes[order.qualityNotes.length - 1]
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{order.id}</h3>
            <p className="text-sm text-gray-400">{order.partName}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <FileText className="w-4 h-4 text-gray-500" />
          <span className="text-gray-400">Material:</span>
          <span className="text-white">{order.material}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Package className="w-4 h-4 text-gray-500" />
          <span className="text-gray-400">Quantity:</span>
          <span className="text-white">{order.quantity} units</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-gray-400">Deadline:</span>
          <span className="text-white">{order.deadline}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-gray-400">Created:</span>
          <span className="text-white">{new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Latest Quality Note */}
      {latestQualityNote && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Latest Quality Note:</p>
              <p className="text-sm text-gray-300">{latestQualityNote.note}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(latestQualityNote.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quality Notes Count */}
      {order.qualityNotes.length > 1 && (
        <div className="mt-2 text-xs text-gray-500">
          +{order.qualityNotes.length - 1} more quality {order.qualityNotes.length === 2 ? 'note' : 'notes'}
        </div>
      )}
    </motion.div>
  );
}

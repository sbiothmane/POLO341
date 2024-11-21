import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const CommentsModal = ({ comments, onClose }) => {
  if (!comments) return null;

  const generateKey = (comment) => `${comment.type}-${comment.comment}`;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Background Overlay */}
<button
  className="absolute inset-0 bg-black bg-opacity-50"
  onClick={onClose}
  aria-label="Close modal"
  style={{ border: 'none', padding: 0, margin: 0 }}
></button>


        {/* Modal Content */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 relative z-10 w-full max-w-lg"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-indigo-600">
              Evaluator's Comments
            </h3>
            <Button variant="ghost" onClick={onClose}>
              <X size={24} className="text-gray-600" />
            </Button>
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {comments.map((comment) => (
              <motion.div
                key={generateKey(comment)}
                className="p-4 bg-gray-50 rounded-lg shadow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-gray-700">
                  <strong className="text-indigo-600">{comment.type}:</strong> {comment.comment}
                </p>
              </motion.div>
            ))}
          </div>
          <Button
            variant="solid"
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={onClose}
          >
            Close
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

CommentsModal.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      comment: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CommentsModal;

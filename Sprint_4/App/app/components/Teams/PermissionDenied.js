import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const PermissionDenied = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="bg-white/80 backdrop-blur-lg border-none shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-center space-x-2 text-yellow-600">
          <AlertTriangle size={24} />
          <p className="text-lg font-semibold">{message}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

PermissionDenied.propTypes = {
  message: PropTypes.string.isRequired,
};

export default PermissionDenied;

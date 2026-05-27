import { motion, AnimatePresence } from 'framer-motion';
import { CelebrationSVG } from '@/components/AnimatedSVG';

interface AcceptSuccessOverlayProps {
  show: boolean;
}

const AcceptSuccessOverlay: React.FC<AcceptSuccessOverlayProps> = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-2xl w-full max-w-sm mx-4"
          >
            <div className="flex justify-center mb-4">
              <CelebrationSVG />
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">Invitation Accepted!</h3>
            <p className="text-muted-foreground">You're now part of the shared subscription</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AcceptSuccessOverlay;

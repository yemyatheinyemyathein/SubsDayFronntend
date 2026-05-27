import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';

type StatCardColor = 'primary' | 'green' | 'blue' | 'orange';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color?: StatCardColor;
}

const colorMap: Record<StatCardColor, { bg: string; text: string; glow: string }> = {
  primary: { bg: 'bg-primary/10', text: 'text-primary', glow: 'hover:shadow-lg hover:shadow-primary/10' },
  green: { bg: 'bg-green-500/10', text: 'text-green-500', glow: 'hover:shadow-lg hover:shadow-green-500/10' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', glow: 'hover:shadow-lg hover:shadow-blue-500/10' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', glow: 'hover:shadow-lg hover:shadow-orange-500/10' },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, color = 'primary' }) => {
  const colors = colorMap[color];
  return (
    <motion.div
      variants={itemVariants}
      className={`card p-6 transition-shadow ${colors.glow}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <Icon size={20} className={colors.text} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;

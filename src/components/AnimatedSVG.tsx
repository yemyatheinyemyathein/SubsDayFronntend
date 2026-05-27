import { motion } from 'framer-motion';

export const InvitationEnvelopeSVG: React.FC = () => {
  return (
    <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.rect
        x="20"
        y="60"
        width="160"
        height="80"
        rx="8"
        fill="url(#envelopeGrad)"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      />
      <motion.path
        d="M20 68L100 120L180 68"
        stroke="white"
        strokeWidth="2"
        fill="rgba(255,255,255,0.1)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      <motion.rect
        x="40"
        y="40"
        width="120"
        height="60"
        rx="4"
        fill="white"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5, type: 'spring' }}
      />
      <motion.line
        x1="60"
        y1="55"
        x2="140"
        y2="55"
        stroke="#667eea"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      />
      <motion.line
        x1="60"
        y1="65"
        x2="120"
        y2="65"
        stroke="#999"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      />
      <motion.line
        x1="60"
        y1="75"
        x2="130"
        y2="75"
        stroke="#999"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      />
      <motion.circle
        cx="100"
        cy="100"
        r="12"
        fill="white"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 1.2, type: 'spring' }}
      />
      <motion.path
        d="M94 100L98 104L106 96"
        stroke="#10b981"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
      />
      <defs>
        <linearGradient id="envelopeGrad" x1="20" y1="60" x2="180" y2="140">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const AnimatedUsersSVG: React.FC = () => {
  return (
    <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.circle
        cx="60"
        cy="50"
        r="20"
        fill="url(#userGrad1)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      />
      <motion.path
        d="M30 110C30 90 45 80 60 80C75 80 90 90 90 110"
        fill="url(#userGrad1)"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
      />
      <motion.circle
        cx="120"
        cy="50"
        r="20"
        fill="url(#userGrad2)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}
      />
      <motion.path
        d="M90 110C90 90 105 80 120 80C135 80 150 90 150 110"
        fill="url(#userGrad2)"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5, type: 'spring' }}
      />
      <motion.path
        d="M85 65L95 75L105 55"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      />
      <motion.circle
        cx="135"
        cy="15"
        r="8"
        fill="#f59e0b"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5, delay: 1, type: 'spring' }}
      />
      <motion.text
        x="135"
        y="19"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        +
      </motion.text>
      <defs>
        <linearGradient id="userGrad1" x1="30" y1="30" x2="90" y2="110">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
        <linearGradient id="userGrad2" x1="90" y1="30" x2="150" y2="110">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const CelebrationSVG: React.FC = () => {
  return (
    <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.circle
        cx="75"
        cy="75"
        r="60"
        fill="url(#celebGrad)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
      />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <motion.line
          key={angle}
          x1={75 + 35 * Math.cos((angle * Math.PI) / 180)}
          y1={75 + 35 * Math.sin((angle * Math.PI) / 180)}
          x2={75 + 50 * Math.cos((angle * Math.PI) / 180)}
          y2={75 + 50 * Math.sin((angle * Math.PI) / 180)}
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
        />
      ))}
      <motion.path
        d="M55 75L68 88L95 62"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />
      <defs>
        <linearGradient id="celebGrad" x1="15" y1="15" x2="135" y2="135">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const MailWithSparklesSVG: React.FC = () => {
  return (
    <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.rect
        x="10"
        y="30"
        width="140"
        height="70"
        rx="10"
        fill="url(#mailGrad)"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      />
      <motion.path
        d="M10 40L80 80L150 40"
        stroke="white"
        strokeWidth="2"
        fill="rgba(255,255,255,0.1)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      {[
        { cx: 30, cy: 20 },
        { cx: 130, cy: 15 },
        { cx: 140, cy: 90 },
        { cx: 20, cy: 95 },
      ].map((pos, i) => (
        <motion.g key={i}>
          <motion.circle
            cx={pos.cx}
            cy={pos.cy}
            r="4"
            fill="#fbbf24"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 0.8], opacity: [0, 1, 0.6] }}
            transition={{ duration: 1, delay: 0.5 + i * 0.2, repeat: Infinity, repeatDelay: 2 }}
          />
          <motion.path
            d={`M${pos.cx - 6} ${pos.cy}L${pos.cx + 6} ${pos.cy}M${pos.cx} ${pos.cy - 6}L${pos.cx} ${pos.cy + 6}`}
            stroke="#fbbf24"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 0.5, delay: 0.6 + i * 0.2, repeat: Infinity, repeatDelay: 2 }}
          />
        </motion.g>
      ))}
      <defs>
        <linearGradient id="mailGrad" x1="10" y1="30" x2="150" y2="100">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
    </svg>
  );
};

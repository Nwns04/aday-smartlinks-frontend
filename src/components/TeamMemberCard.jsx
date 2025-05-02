// src/components/TeamMemberCard.jsx
import { motion } from "framer-motion";

const TeamMemberCard = ({ name, role, bio, className }) => (
  <motion.div 
    className={`
      ${className}
      bg-white dark:bg-gray-800
      p-6 rounded-xl
      shadow-md dark:shadow-gray-700/50
      hover:shadow-lg dark:hover:shadow-gray-600/40
      transition-shadow
    `}
    whileHover={{ y: -5 }}
  >
    <div
      className="
        w-20 h-20 rounded-full
        bg-gradient-to-r from-blue-500 to-purple-500
        flex items-center justify-center
        text-white text-2xl font-bold
        mb-4 mx-auto
      "
    >
      {name.charAt(0)}
    </div>

    <h3 className="text-xl font-bold text-center text-gray-900 dark:text-gray-100">
      {name}
    </h3>

    <p className="text-blue-600 dark:text-blue-400 text-center mb-3">
      {role}
    </p>

    <p className="text-gray-700 dark:text-gray-300 text-center">
      {bio}
    </p>
  </motion.div>
);

export default TeamMemberCard;

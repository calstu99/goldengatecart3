import { FaStar } from 'react-icons/fa';

const Star = ({ filled }) => {
  return (
    // <FaStar color={filled ? 'gold' : 'gray'} />
    <FaStar color={filled ? '#FFD700' : '#898676'} />
  );
};

export default Star;
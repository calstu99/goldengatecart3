import { FaStar } from 'react-icons/fa';

const Star = ({ filled }) => {
  return (
    // <FaStar color={filled ? 'gold' : 'gray'} />
    <FaStar color={filled ? '#FFD700' : '#808080'} />
  );
};

export default Star;
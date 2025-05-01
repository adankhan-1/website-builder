import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="absolute top-4 left-4 bg-cyan-500 hover:text-cyan-900 text-white px-4 py-2 rounded"
    >
      Back
    </button>
  );
};

export default BackButton;

import { useNavigate } from "react-router-dom";

const LogoutButton = () => {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("google_user");

    navigate("/login");
  };

  return (

    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
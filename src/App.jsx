import { useEffect } from "react";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import './shared/styles/Variables.scss'

function App() {
  const navigate = useNavigate();
  const match = useMatch('/dvalogisticsllc.com/')
  
  useEffect(() => {
    if (match) {
      navigate('/dvalogisticsllc.com/apply');
    }
  }, [navigate, match])

  return (
    <div>
      <Outlet/>
    </div>
  );
}

export default App;

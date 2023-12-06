import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./util/appRoutes";

function App() {
  return (
    <div >
      <Router>
        <AppRoutes/>
      </Router>
    </div>
  );
}

export default App;

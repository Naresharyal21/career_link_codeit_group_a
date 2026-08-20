import AppRoutes from "./Routes";
import ThemeContext from "./context/ThemeContext";

function App() {
    return (
        <ThemeContext>
            <AppRoutes />
        </ThemeContext>
    );
}

export default App;
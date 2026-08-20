import AppRoutes from "./Routes";
import ThemeContext from "./context/ThemeContext";

const App = () => {
    return (
        <ThemeContext>
            <AppRoutes />
        </ThemeContext>
    );
};

export default App;
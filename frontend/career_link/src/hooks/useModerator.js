import useApi from "./useApi";
import moderatorApi from "../apis/moderatorApi";

const useModerator = () => {
    const { data, loading, error, execute } = useApi();

    const adminlogin = async (credentials) => {
        return execute(() => moderatorApi.adminlogin(credentials));
    };

    return {
        data,
        loading,
        error,
        adminlogin,
    };
};

export default useModerator;

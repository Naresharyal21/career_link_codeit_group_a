import PostJobPage from "../employer/pages/PostJobPage";
import MyJobPostingsPage from "../employer/pages/MyJobPostingsPage";

const employerRoutes = [
    {
        path: "employer/post-job",
        element: <PostJobPage />,
    },
    {
        path: "employer/jobs",
        element: <MyJobPostingsPage />,
    },
];

export default employerRoutes;

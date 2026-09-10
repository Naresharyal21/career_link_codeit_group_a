import PostJobPage from "../employer/pages/PostJobPage";
import MyJobPostingsPage from "../employer/pages/MyJobPostingsPage";
import EditJobPage from "../employer/pages/EditJobPage";

const employerRoutes = [
    {
        path: "employer/post-job",
        element: <PostJobPage />,
    },
    {
        path: "employer/jobs",
        element: <MyJobPostingsPage />,
    },
    {
        path: "employer/edit-job/:id",
        element: <EditJobPage />,
    },
];

export default employerRoutes;

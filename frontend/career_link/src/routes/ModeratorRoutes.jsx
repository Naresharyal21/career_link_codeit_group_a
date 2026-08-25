import ModeratorDashboard from "../moderator/pages/ModeratorDashboard";
import ReportList from "../moderator/pages/ReportList";
import ReportDetail from "../moderator/pages/ReportDetail";
import ReviewQueue from "../moderator/pages/ReviewQueue";
import CreateReport from "../moderator/pages/CreateReport";

const moderatorRoutes = [
    {
        path: "moderator",
        element: <ModeratorDashboard />,
    },
    {
        path: "moderator/reports",
        element: <ReportList />,
    },
    {
        path: "moderator/reports/:id",
        element: <ReportDetail />,
    },
    {
        path: "moderator/review-queue",
        element: <ReviewQueue />,
    },
    {
        path: "moderator/reports/create",
        element: <CreateReport />,
    },
];

export default moderatorRoutes;
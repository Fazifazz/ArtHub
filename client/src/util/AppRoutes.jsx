import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ServerVariables } from "./ServerVariables";
import { useSelector } from "react-redux";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/User/LoginPage";
import ArtistLogin from "../pages/Artist/ArtistLogin";
import Register from "../pages/User/Register";
import ArtistRegister from "../pages/Artist/ArtistRegister";
import OtpVerification from "../pages/User/OtpRegister";
import UserHome from "../pages/User/UserHome";
import Dashboard from "../pages/Admin/Dashbord";
import Users from "../pages/Admin/Users";
import Categories from "../pages/Admin/Categories";
import AddCategory from "../pages/Admin/AddCategory";
import EditCategory from "../pages/Admin/EditCategory";
import AdminLogin from "../pages/Admin/AdminLogin";
import IsLoggedOutUser from "../components/middlewares/IsLoggedOutUser";
import IsLoggedUser from "../components/middlewares/IsLoggedUser";
import Plans from "../pages/Admin/Plans";
import AddPlan from "../pages/Admin/AddPlan";
import EditPlan from "../pages/Admin/EditPlan";
import ArtistOtp from "../pages/Artist/ArtistOtp";
import ArtistHome from "../pages/Artist/ArtistHome";
import IsArtistLoggedOut from "../components/middlewares/IsArtistLoggedOut";
import IsArtistLogged from "../components/middlewares/IsArtistLogged";
import Artists from "../pages/Admin/Artists";
import IsAdminLoggedOut from "../components/middlewares/IsAdminLoggedOut";
import IsAdminLogged from "../components/middlewares/IsAdminLogged";
import VerifyEmail from "../pages/User/VerifyEmail";
import ForgetOtp from "../pages/User/ForgetOtp";
import ChangePassword from "../pages/User/ChangePassword";
import ArtistForgetOtp from "../pages/Artist/ArtistForgetOtp";
import ArtistVerifyEmail from "../pages/Artist/ArtistVerifyEmail";
import ArtistChangePassword from "../pages/Artist/ArtistChangePassword";
import SubscriptionPlans from "../pages/Artist/PlansAvailable";
import SuccessPage from "../pages/Artist/SuccessPage";
import PostPage from "../pages/Artist/ArtistPosts";
import AddPost from "../pages/Artist/AddPost";
import ArtistProfile from "../pages/Artist/ArtistProfile";
import EditArtistProfile from "../pages/Artist/EditArtistProfile";
import UserProfile from "../pages/User/UserProfile";
import EditUserProfile from "../pages/User/EditUserProfile";
import ArtistView from "../pages/Admin/ArtistView";
import ShowArtists from "../pages/User/ShowArtists";
import ViewArtistDetails from "../pages/User/ViewArtistDetails";
import PaymentFailPage from "../pages/Artist/ErrorPage";
import PaymentSuccessPage from "../pages/Artist/SuccessPage";
import SubscriptionHistory from "../pages/Admin/SubscriptionHistory";
import Banners from "../pages/Admin/Banners";
import AddBanner from "../pages/Admin/AddBanner";
import EditBanner from "../pages/Admin/EditBanner";
import AboutPage from "../components/AboutPage";
import ErrorPage from "../pages/404ErrorPage";
import ChatWithArtist from "../pages/User/Chat";
import ArtistChatPage from "../pages/Artist/ArtistChatPage";
import ArtistNotification from "../pages/Artist/ArtistNotification";
import UserNotification from "../pages/User/UserNotifications";

function AppRoutes() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <div>
      {/* loading spinner ui */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-gray-100 bg-opacity-90">
          <div className="text-blue-500 flex justify-center items-center">
            <svg
              className="animate-spin h-16 w-16 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.96 7.96 0 014 12H0c0 6.627 5.373 12 12 12v-4c-3.313 0-6.292-1.29-8.544-3.544l1.414-1.414z"
              ></path>
            </svg>
          </div>
        </div>
      )}

      {/* toast ui */}
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path={ServerVariables.Landing} element={<LandingPage />} />
        <Route path="*" element={<ErrorPage />} />

        {/* user routes */}
        <Route element={<IsLoggedOutUser />}>
          <Route path={ServerVariables.Login} element={<LoginPage />} />
          <Route path={ServerVariables.Register} element={<Register />} />
          <Route path={ServerVariables.verifyEmail} element={<VerifyEmail />} />
          <Route path={ServerVariables.forgetOtp} element={<ForgetOtp />} />
          <Route
            path={ServerVariables.changePassword}
            element={<ChangePassword />}
          />
          <Route
            path={ServerVariables.verifyOtp}
            element={<OtpVerification />}
          />
        </Route>

        <Route element={<IsLoggedUser />}>
          <Route path={ServerVariables.userHome} element={<UserHome />} />
          <Route path={ServerVariables.userProfile} element={<UserProfile />} />
          <Route
            path={ServerVariables.editUserProfile}
            element={<EditUserProfile />}
          />
          <Route path={ServerVariables.showArtists} element={<ShowArtists />} />
          <Route
            path={ServerVariables.viewArtistDetails}
            element={<ViewArtistDetails />}
          />
          <Route path={ServerVariables.about} element={<AboutPage />} />
          <Route path={ServerVariables.chatWithArtist} element={<ChatWithArtist />} />
          <Route path={ServerVariables.userNotifications} element={<UserNotification />} />
        </Route>

        {/*artist routes */}
        <Route element={<IsArtistLoggedOut />}>
          <Route path={ServerVariables.ArtistLogin} element={<ArtistLogin />} />
          <Route
            path={ServerVariables.ArtistRegister}
            element={<ArtistRegister />}
          />
          <Route
            path={ServerVariables.ArtistVerifyOtp}
            element={<ArtistOtp />}
          />
          <Route
            path={ServerVariables.artistVerifyEmail}
            element={<ArtistVerifyEmail />}
          />
          <Route
            path={ServerVariables.forgetArtistOtp}
            element={<ArtistForgetOtp />}
          />
          <Route
            path={ServerVariables.artistChangePassword}
            element={<ArtistChangePassword />}
          />
        </Route>
        <Route element={<IsArtistLogged />}>
          <Route path={ServerVariables.ArtistHome} element={<ArtistHome />} />
          <Route
            path={ServerVariables.plansAvailable}
            element={<SubscriptionPlans />}
          />
          <Route
            path={ServerVariables.successPage}
            element={<PaymentSuccessPage />}
          />
          <Route
            path={ServerVariables.errorPage}
            element={<PaymentFailPage />}
          />
          <Route path={ServerVariables.artistPosts} element={<PostPage />} />
          <Route path={ServerVariables.addPost} element={<AddPost />} />
          <Route
            path={ServerVariables.artistProfile}
            element={<ArtistProfile />}
          />
          <Route
            path={ServerVariables.editArtistProfile}
            element={<EditArtistProfile />}
          />
          <Route
            path={ServerVariables.artistChatPage}
            element={<ArtistChatPage />}
          />
          <Route
            path={ServerVariables.artistNotifications}
            element={<ArtistNotification />}
          />
        </Route>

        {/* admin routes */}
        <Route element={<IsAdminLoggedOut />}>
          <Route path={ServerVariables.AdminLogin} element={<AdminLogin />} />
        </Route>
        <Route element={<IsAdminLogged />}>
          <Route
            path={ServerVariables.AdminDashboard}
            element={<Dashboard />}
          />
          <Route path={ServerVariables.Users} element={<Users />} />
          <Route path={ServerVariables.Categories} element={<Categories />} />
          <Route path={ServerVariables.AddCategory} element={<AddCategory />} />
          <Route
            path={ServerVariables.EditCategory}
            element={<EditCategory />}
          />
          <Route path={ServerVariables.Plans} element={<Plans />} />
          <Route path={ServerVariables.AddPlan} element={<AddPlan />} />
          <Route path={ServerVariables.Editplan} element={<EditPlan />} />
          <Route path={ServerVariables.Artists} element={<Artists />} />
          <Route path={ServerVariables.ViewArtist} element={<ArtistView />} />
          <Route path={ServerVariables.banners} element={<Banners />} />
          <Route path={ServerVariables.addBanner} element={<AddBanner />} />
          <Route path={ServerVariables.editBanner} element={<EditBanner />} />
          <Route
            path={ServerVariables.subscriptionPlanHistory}
            element={<SubscriptionHistory />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default AppRoutes;

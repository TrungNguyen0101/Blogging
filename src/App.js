import { Routes, Route } from "react-router-dom";
import CategoryAddNew from "./component/layout/category/CategoryAddNew";
import CategoryManage from "./component/layout/category/CategoryManage";
import CategoryUpdate from "./component/layout/category/CategoryUpdate";
import DashboardLayout from "./component/layout/dashboard/DashboardLayout";
import PostAddNew from "./component/layout/post/PostAddNew";
import PostManage from "./component/layout/post/PostManage";
import PostUpdate from "./component/layout/post/PostUpdate";
import UserAddNew from "./component/layout/user/UserAddNew";
import UserManage from "./component/layout/user/UserManage";
import UserUpdate from "./component/layout/user/UserUpdate";
import { AuthProvider } from "./contexts/auth-context";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import PostDetailsPage from "./pages/PostDetailsPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage></HomePage>}></Route>
          <Route path="/sign-up" element={<SignUpPage></SignUpPage>}></Route>
          <Route path="/sign-in" element={<SignInPage></SignInPage>}></Route>
          <Route path="/*" element={<NotFoundPage></NotFoundPage>}></Route>
          <Route
            path="/:id"
            element={<PostDetailsPage></PostDetailsPage>}
          ></Route>
          <Route element={<DashboardLayout></DashboardLayout>}>
            {/* Outlet */}
            <Route
              path="/dashboard"
              element={<DashboardPage></DashboardPage>}
            ></Route>
            <Route
              path="/manage/post"
              element={<PostManage></PostManage>}
            ></Route>
            <Route
              path="/manage/add-post"
              element={<PostAddNew></PostAddNew>}
            ></Route>
            <Route
              path="/manage/update-post"
              element={<PostUpdate></PostUpdate>}
            ></Route>
            <Route
              path="/manage/category"
              element={<CategoryManage></CategoryManage>}
            ></Route>
            <Route
              path="/manage/add-category"
              element={<CategoryAddNew></CategoryAddNew>}
            ></Route>
            <Route
              path="/manage/update-category"
              element={<CategoryUpdate></CategoryUpdate>}
            ></Route>
            <Route
              path="/manage/user"
              element={<UserManage></UserManage>}
            ></Route>
            <Route
              path="/manage/add-user"
              element={<UserAddNew></UserAddNew>}
            ></Route>
            <Route
              path="/manage/update-user"
              element={<UserUpdate></UserUpdate>}
            ></Route>
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;

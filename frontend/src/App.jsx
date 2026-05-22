import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./services/ProtectedRoute";
import RoleRoute from "./services/RoleRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ExamList from "./pages/ExamList";
import TakeExam from "./pages/TakeExam";
import Results from "./pages/Results";

import AdminDashboard from "./pages/AdminDashboard";
import Analytics from "./pages/Analytics";
import ProfileSettings from "./pages/ProfileSettings";
import AccountPreferences from "./pages/AccountPreferences";
import CreateExam from "./pages/CreateExam";
import QuestionBuilder from "./pages/QuestionBuilder";
import Review from "./pages/Review";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PROTECTED APP LAYOUT */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          
          {/* SHARED ROUTES */}
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/settings" element={<AccountPreferences />} />

          {/* STUDENT ROUTES */}
          <Route element={<RoleRoute allowedRoles={["student"]} />}>
            <Route path="/exams" element={<ExamList />} />
            <Route path="/exam/:id" element={<TakeExam />} />
            <Route path="/results" element={<Results />} />
            <Route path="/review/:id" element={<Review />} />
          </Route>

          {/* ADMIN ROUTES */}
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/admin/create-exam" element={<CreateExam />} />
            <Route path="/admin/exam/:id/questions" element={<QuestionBuilder />} />
          </Route>

        </Route>
      </Route>

      {/* FALLBACK ROUTE */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
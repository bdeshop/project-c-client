import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import { LoginPage } from "./pages/LoginPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { UsersPage } from "./pages/UsersPage";
import { SlidersPage } from "./pages/SlidersPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SecurityPage } from "./pages/SecurityPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TopWinnersPage } from "./pages/top-winners";
import { UpcomingMatchesPage } from "./pages/upcoming-matches";
import { PromotionPage } from "./pages/promotion";
import PromotionsListPage from "./pages/promotion/PromotionsListPage";
import EditPromotionPage from "./pages/promotion/EditPromotionPage";
import ViewPromotionPage from "./pages/promotion/ViewPromotionPage";
import TransactionsPage from "./pages/transactions/TransactionsPage";
import CreateTransactionPage from "./pages/transactions/CreateTransactionPage";
import ViewTransactionPage from "./pages/transactions/ViewTransactionPage";
import EditTransactionPage from "./pages/transactions/EditTransactionPage";
import DepositPage from "./pages/deposit/DepositPage";
import AddDepositMethodPage from "./pages/deposit/AddDepositMethodPage";
import ViewDepositMethodPage from "./pages/deposit/ViewDepositMethodPage";
import EditDepositMethodPage from "./pages/deposit/EditDepositMethodPage";
import DepositRequestsPage from "./pages/deposit/DepositRequestsPage";
import AddPromotionPage from "./pages/deposit/AddPromotionPage";
import ContactSettingsPage from "./pages/contact/ContactSettingsPage";
import WithdrawPage from "./pages/withdraw/WithdrawPage";
import AddWithdrawMethodPage from "./pages/withdraw/AddWithdrawMethodPage";
import ViewWithdrawMethodPage from "./pages/withdraw/ViewWithdrawMethodPage";
import EditWithdrawMethodPage from "./pages/withdraw/EditWithdrawMethodPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
// import { ReferralPage } from "./pages/referral";
// import { ReferralSettingsPage } from "./pages/referral/ReferralSettingsPage";
import { AuthService } from "./lib/auth";
import "./globals.css";
import { ReferralPage } from "./pages/referral/ReferralPage";

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = AuthService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public Route component (redirects to dashboard if already authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = AuthService.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  // Set dark theme on mount
  React.useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <Router>
      <Toaster />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            AuthService.isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="slider" element={<SlidersPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="security" element={<SecurityPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="top-winners" element={<TopWinnersPage />} />
          <Route path="upcoming-matches" element={<UpcomingMatchesPage />} />
          <Route path="promotion" element={<PromotionPage />} />
          <Route path="promotions" element={<PromotionsListPage />} />
          <Route path="promotions/view/:id" element={<ViewPromotionPage />} />
          <Route path="promotions/edit/:id" element={<EditPromotionPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route
            path="transactions/create"
            element={<CreateTransactionPage />}
          />
          <Route
            path="transactions/view/:id"
            element={<ViewTransactionPage />}
          />
          <Route
            path="transactions/edit/:id"
            element={<EditTransactionPage />}
          />
          <Route path="deposit" element={<DepositPage />} />
          <Route path="deposit/add-method" element={<AddDepositMethodPage />} />
          <Route path="deposit/view/:id" element={<ViewDepositMethodPage />} />
          <Route path="deposit/edit/:id" element={<EditDepositMethodPage />} />
          <Route path="deposit/add-promotion" element={<AddPromotionPage />} />
          <Route path="deposit/requests" element={<DepositRequestsPage />} />
          <Route path="withdraw" element={<WithdrawPage />} />
          <Route
            path="withdraw/add-method"
            element={<AddWithdrawMethodPage />}
          />
          <Route
            path="withdraw/view/:id"
            element={<ViewWithdrawMethodPage />}
          />
          <Route
            path="withdraw/edit/:id"
            element={<EditWithdrawMethodPage />}
          />
          <Route path="referral" element={<ReferralPage />} />
          <Route path="contact" element={<ContactSettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          {/* <Route path="referral/settings" element={<ReferralSettingsPage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

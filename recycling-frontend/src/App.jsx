import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { RequireAdmin, RequireAuth } from './components/Guards';
import MapPage from './pages/MapPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReportPage from './pages/ReportPage';
import MyReportsPage from './pages/MyReportsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminLocationsPage from './pages/admin/AdminLocationsPage';
import NotFoundPage from './pages/NotFoundPage';
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<MapPage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route element={<RequireAuth />}>
                        <Route path="/reports" element={<ReportPage />} />
                        <Route path="/my-reports" element={<MyReportsPage />} />
                    </Route>

                    <Route element={<RequireAdmin />}>
                        <Route path="/admin/reports" element={<AdminReportsPage />} />
                        <Route path="/admin/locations" element={<AdminLocationsPage />} />
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

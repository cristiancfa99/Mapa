import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WorkoutProvider } from './contexts/WorkoutContext';
import { BottomNav } from './components/common/BottomNav';
import { SplashScreen } from './screens/SplashScreen';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ExerciseLibraryScreen } from './screens/ExerciseLibraryScreen';
import { ExerciseDetailScreen } from './screens/ExerciseDetailScreen';
import { RoutineBuilderScreen } from './screens/RoutineBuilderScreen';
import { ActiveWorkoutScreen } from './screens/ActiveWorkoutScreen';
import { StatisticsScreen } from './screens/StatisticsScreen';
import { NutritionScreen } from './screens/NutritionScreen';
import { CommunityScreen } from './screens/CommunityScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const NAV_SCREENS = ['/home', '/exercises', '/stats', '/profile', '/routines', '/nutrition', '/community'];

const AppShell: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const showNav = isAuthenticated && NAV_SCREENS.some(s => location.pathname.startsWith(s));

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/auth" element={!isAuthenticated ? <AuthScreen /> : <Navigate to="/home" replace />} />

        {/* Protected routes */}
        <Route path="/home"      element={isAuthenticated ? <HomeScreen /> : <Navigate to="/auth" replace />} />
        <Route path="/exercises" element={isAuthenticated ? <ExerciseLibraryScreen /> : <Navigate to="/auth" replace />} />
        <Route path="/exercises/:id" element={isAuthenticated ? <ExerciseDetailScreen /> : <Navigate to="/auth" replace />} />
        <Route path="/routines"  element={isAuthenticated ? <RoutineBuilderScreen /> : <Navigate to="/auth" replace />} />
        <Route path="/workout"   element={isAuthenticated ? <ActiveWorkoutScreen /> : <Navigate to="/auth" replace />} />
        <Route path="/stats"     element={isAuthenticated ? <StatisticsScreen /> : <Navigate to="/auth" replace />} />
        <Route path="/nutrition" element={isAuthenticated ? <NutritionScreen /> : <Navigate to="/auth" replace />} />
        <Route path="/community" element={isAuthenticated ? <CommunityScreen /> : <Navigate to="/auth" replace />} />
        <Route path="/profile"   element={isAuthenticated ? <ProfileScreen /> : <Navigate to="/auth" replace />} />
        <Route path="/settings"  element={isAuthenticated ? <SettingsScreen /> : <Navigate to="/auth" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showNav && <BottomNav />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WorkoutProvider>
          <Router>
            <AppShell />
          </Router>
        </WorkoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

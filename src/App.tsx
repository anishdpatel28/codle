import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthProvider';
import { DailyPage } from './pages/DailyPage';
import { ArchivePage } from './pages/ArchivePage';
import { PracticePage } from './pages/PracticePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DailyPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/practice/:date" element={<PracticePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

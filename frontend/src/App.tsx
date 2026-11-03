import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AgrivaultProvider } from './context/AgrivaultContext';
import { Layout } from './components/layout/Layout';

// 10 Application Pages
import { OverviewPage } from './pages/OverviewPage';
import { StorageUnitsPage } from './pages/StorageUnitsPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { PestDetectionPage } from './pages/PestDetectionPage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { HotspotMapPage } from './pages/HotspotMapPage';
import { AlertsPage } from './pages/AlertsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { InterventionsPage } from './pages/InterventionsPage';
import { ReportsPage } from './pages/ReportsPage';

export const App: React.FC = () => {
  return (
    <AgrivaultProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/storage-units" element={<StorageUnitsPage />} />
            <Route path="/monitoring" element={<LiveMonitoringPage />} />
            <Route path="/pest-detection" element={<PestDetectionPage />} />
            <Route path="/risk-analysis" element={<RiskAnalysisPage />} />
            <Route path="/hotspot-map" element={<HotspotMapPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/interventions" element={<InterventionsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AgrivaultProvider>
  );
};

export default App;

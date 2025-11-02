import { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import UploadSection from './components/UploadSection';
import KnowledgeMesh from './components/KnowledgeMesh';
import Flashcards from './components/Flashcards';
import Settings from './components/Settings';
import Auth from './components/Auth';
import TableList from './components/TableList';
import AnimatedBackground from './components/AnimatedBackground';
import { useAuth } from './contexts/AuthContext';
import { useData } from './contexts/DataContext';
import { ROUTES } from './config/routes';

function App() {
  const [activeView, setActiveView] = useState(ROUTES.DASHBOARD);
  const { user, userRole, loading: authLoading, signOut } = useAuth();
  const { materials, flashcards, graphData, loading: dataLoading, addMaterial, deleteMaterial } = useData();

  const loading = authLoading || dataLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-text-light text-lg">Loading MindMesh...</p>
        </div>
      </div>
    );
  }

  const handleAuthSuccess = () => {
    setActiveView(ROUTES.DASHBOARD);
  };

  const handleLogout = async () => {
    await signOut();
    setActiveView(ROUTES.AUTH);
  };

  const handleMaterialAdded = async (newMaterial) => {
    await addMaterial(newMaterial);
  };

  const handleDeleteMaterial = async (materialId) => {
    await deleteMaterial(materialId);
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Content */}
      <div className="relative z-10">
        <Header 
          activeView={activeView} 
          setActiveView={setActiveView}
          user={user}
          userRole={userRole}
          onLogout={handleLogout}
        />
        
        <main className="container mx-auto px-4 py-6 max-w-7xl">
        {activeView === ROUTES.AUTH && (
          <Auth onAuthSuccess={handleAuthSuccess} />
        )}

        {activeView === ROUTES.DASHBOARD && (
          <Dashboard 
            materials={materials}
            flashcards={flashcards}
            graphData={graphData}
            onDeleteMaterial={handleDeleteMaterial}
            onNavigate={setActiveView}
          />
        )}
        
        {activeView === ROUTES.UPLOAD && (
          <UploadSection onMaterialAdded={handleMaterialAdded} />
        )}
        
        {activeView === 'graph' && (
          <KnowledgeMesh 
            graphData={graphData}
            materials={materials}
          />
        )}
        
        {activeView === ROUTES.FLASHCARDS && (
          <Flashcards 
            flashcards={flashcards}
            materials={materials}
          />
        )}
        
        {activeView === ROUTES.DATA && userRole === 'admin' ? (
          <TableList />
        ) : activeView === ROUTES.DATA ? (
          <div className="card bg-white/10 backdrop-blur-sm border border-white/20 text-center py-12">
            <h2 className="text-2xl font-bold text-primary mb-4">🔒 Admin Access Required</h2>
            <p className="text-text-muted mb-6">
              Only administrators can access the database viewer.
            </p>
            {!user && (
              <button
                onClick={() => setActiveView(ROUTES.AUTH)}
                className="btn-primary"
              >
                Login as Admin
              </button>
            )}
          </div>
        ) : null}
        
        {activeView === ROUTES.SETTINGS && (
          <Settings />
        )}
      </main>
      </div>
    </div>
  );
}

export default App;

import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import Splash from './pages/Splash';
import PinLogin from './pages/PinLogin';
import Home from './pages/Home';
import Transfers from './pages/Transfers';
import IbanTransfer from './pages/IbanTransfer';
import TransferPreview from './pages/TransferPreview';
import TransferSuccess from './pages/TransferSuccess';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import AccountDetail from './pages/AccountDetail';
import BankLayout from './components/BankLayout';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<PinLogin />} />
      <Route element={<BankLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/transfers" element={<Transfers />} />
        <Route path="/transfer/iban" element={<IbanTransfer />} />
        <Route path="/transfer/preview" element={<TransferPreview />} />
        <Route path="/transfer/success" element={<TransferSuccess />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/account/:id" element={<AccountDetail />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
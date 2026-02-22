import { BrowserRouter, Route, Routes } from 'react-router-dom';

import OrganizationDetails from './pages/organizations/[id]/page';
import Organizations from './pages/organizations/page';
import Home from './pages/page';
import TestPage from './pages/test/page';
import UserDetails from './pages/users/[id]/page';
import Users from './pages/users/page';

function App() {
  return (
    <BrowserRouter basename="/sb_backoffice">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/organizations/:id" element={<OrganizationDetails />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

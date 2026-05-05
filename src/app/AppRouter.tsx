import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PlaceholderPage from '@/pages/PlaceholderPage';
import DevAtoms from '@/pages/DevAtoms';
import DevPanel from '@/components/DevPanel';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<PlaceholderPage name="Logistics" />} />
      <Route path="/address/map" element={<PlaceholderPage name="AddressMap" />} />
      <Route path="/address/type" element={<PlaceholderPage name="AddressType" />} />
      <Route path="/address/details" element={<PlaceholderPage name="AddressDetails" />} />
      <Route path="/addresses" element={<PlaceholderPage name="SavedAddresses" />} />
      <Route path="/order/instructions" element={<PlaceholderPage name="Instructions" />} />
      <Route path="/order/instructions/add" element={<PlaceholderPage name="InstructionsAdd" />} />
      <Route path="/order/last-step" element={<PlaceholderPage name="LastStep" />} />
      <Route path="/orders" element={<PlaceholderPage name="LiveOrders" />} />
      <Route path="/dev/atoms" element={<DevAtoms />} />
      <Route path="*" element={<PlaceholderPage name="NotFound" />} />
    </Routes>
    <DevPanel />
  </BrowserRouter>
);

export default AppRouter;
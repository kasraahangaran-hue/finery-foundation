import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useNativeBack } from "@/lib/useNativeBack";
import PlaceholderPage from "@/pages/PlaceholderPage";
import DevAtoms from "@/pages/DevAtoms";
import OrderStep1 from "@/pages/finery/OrderStep1";
import OrderStep2 from "@/pages/finery/OrderStep2";
import LastStepScreen from "@/pages/finery/LastStepScreen";
import OrderConfirmationScreen from "@/pages/finery/OrderConfirmationScreen";
import PhotoMetadataScreen from "@/pages/finery/PhotoMetadataScreen";
import AddressMapScreen from "@/pages/finery/AddressMapScreen";
import AddressTypeScreen from "@/pages/finery/AddressTypeScreen";
import AddressDetailsScreen from "@/pages/finery/AddressDetailsScreen";
import { OrderShell } from "@/components/primitives/OrderShell";
import { StateInspector } from "@/components/dev/StateInspector";

const AppShell = () => {
  useNativeBack();
  return (
    <Routes>
      <Route element={<OrderShell />}>
        <Route path="/" element={<OrderStep1 />} />
        <Route path="/order/instructions" element={<OrderStep2 />} />
        <Route path="/order/last-step" element={<LastStepScreen />} />
      </Route>

      <Route path="/address/map" element={<AddressMapScreen />} />
      <Route path="/address/type" element={<AddressTypeScreen />} />
      <Route path="/address/details" element={<AddressDetailsScreen />} />
      <Route path="/order/instructions/photo" element={<PhotoMetadataScreen />} />
      <Route path="/addresses" element={<PlaceholderPage name="SavedAddresses" />} />
      <Route path="/order/instructions/add" element={<PlaceholderPage name="InstructionsAdd" />} />
      <Route path="/orders" element={<PlaceholderPage name="LiveOrders" />} />
      <Route path="/order/confirmed" element={<OrderConfirmationScreen />} />
      <Route path="/dev/atoms" element={<DevAtoms />} />

      <Route path="*" element={<PlaceholderPage name="NotFound" />} />
    </Routes>
  );
};

const AppRouter = () => (
  <BrowserRouter>
    <AppShell />
    <StateInspector />
  </BrowserRouter>
);

export default AppRouter;
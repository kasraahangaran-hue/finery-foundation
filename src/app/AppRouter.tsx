import { BrowserRouter, Route, Routes } from "react-router-dom";
import PlaceholderPage from "@/pages/PlaceholderPage";
import DevAtoms from "@/pages/DevAtoms";
import OrderStep1 from "@/pages/finery/OrderStep1";
import AddressMapScreen from "@/pages/finery/AddressMapScreen";
import AddressTypeScreen from "@/pages/finery/AddressTypeScreen";
import AddressDetailsScreen from "@/pages/finery/AddressDetailsScreen";
import { OrderShell } from "@/components/primitives/OrderShell";
import { StateInspector } from "@/components/dev/StateInspector";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<OrderShell />}>
        <Route path="/" element={<OrderStep1 />} />
        <Route path="/order/instructions" element={<PlaceholderPage name="Instructions" />} />
        <Route path="/order/last-step" element={<PlaceholderPage name="LastStep" />} />
      </Route>

      <Route path="/address/map" element={<AddressMapScreen />} />
      <Route path="/address/type" element={<AddressTypeScreen />} />
      <Route path="/address/details" element={<AddressDetailsScreen />} />
      <Route path="/addresses" element={<PlaceholderPage name="SavedAddresses" />} />

      <Route path="/order/instructions/add" element={<PlaceholderPage name="InstructionsAdd" />} />
      <Route path="/orders" element={<PlaceholderPage name="LiveOrders" />} />
      <Route path="/dev/atoms" element={<DevAtoms />} />

      <Route path="*" element={<PlaceholderPage name="NotFound" />} />
    </Routes>
    <StateInspector />
  </BrowserRouter>
);

export default AppRouter;
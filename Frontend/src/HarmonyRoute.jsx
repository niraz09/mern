import { Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import Login from "./user/Login"
import Register from "./user/Register"
import ReadAllUser from "./user/ReadAllUser"
import ReadAllGuitar from "./guitar/ReadAllGuitar"
import ReadSingleGuitar from "./guitar/ReadSingleGuitar"
import CreateGuitar from "./guitar/CreateGuitar"
import UpdateGuitar from "./guitar/UpdateGuitar"
import MyGuitars from "./guitar/MyGuitars"
import AdminGuitar from "./guitar/AdminGuitar"
import Cart from "./cart/Cart"
import Checkout from "./cart/Checkout"
import MyOrders from "./order/MyOrders"
import MySales from "./order/MySales"
import AdminOrder from "./order/AdminOrder"

const HarmonyRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />

      <Route path="/guitar" element={<ReadAllGuitar />} />
      <Route path="/guitar/:id" element={<ReadSingleGuitar />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />

      {/* selling: any logged in user */}
      <Route path="/sell" element={<ProtectedRoute><CreateGuitar /></ProtectedRoute>} />
      <Route path="/sell/edit/:id" element={<ProtectedRoute><UpdateGuitar /></ProtectedRoute>} />
      <Route path="/my-guitars" element={<ProtectedRoute><MyGuitars /></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><MySales /></ProtectedRoute>} />

      <Route path="/admin/guitar" element={<ProtectedRoute admin><AdminGuitar /></ProtectedRoute>} />
      <Route path="/admin/order" element={<ProtectedRoute admin><AdminOrder /></ProtectedRoute>} />
      <Route path="/admin/user" element={<ProtectedRoute admin><ReadAllUser /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default HarmonyRoute

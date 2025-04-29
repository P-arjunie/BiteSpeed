import BiteSpeedHomePage from './customer/LandingPage'
import AdminDashboard from './admin/OrdersChart'
import CustomerOrderTracking from './customer/CustomerOrderTrcking'
import CustomerLoginForm from './customer/CustomerLoginForm'
import CustomerRegisterForm from './customer/CustomerRegisterForm'
import CustomerProfile from './customer/CustomerProfile'
import CustomerHome from './customer/CustomerHome'
import ViewMenu from "./customer/ViewMenu";


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DriverRegisterForm from './driver/DriverRegisterForm';
import DriverLoginForm from './driver/DriverLoginForm';
import DriverDashboard from './driver/DriverDashboard';
import TrackingMap from './components/TrackingMap';
import DriverProfile from './driver/DriverProfile';
import AddVehicle from './driver/AddVehicle';
import FindOrders from './driver/FindOrders';
import OrderTracking from './driver/OrderTracking'

// This is the default content shown at /dashboard
const DashboardHome = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-800 mb-4">Driver Dashboard</h1>
    <p className="text-gray-600 mb-6">Welcome! You're successfully logged in.</p>
    <div className="border rounded p-6 bg-gray-50">
      <p className="text-gray-500 text-center">Dashboard content coming soon...</p>
    </div>
  </div>
);



import RestaurantRegister from './restaurant/RestaurantRegister'
import RestaurantLogin from './restaurant/RestaurantLogin'
import RestaurantDashboard from './restaurant/RestaurantDashboard'
import RestaurantProfile from './restaurant/RestaurantProfile'
import MenuManagement from './restaurant/MenuManagement'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HandleOrders from './restaurant/HandleOrders'


import CartPage from './order/CartPage';
import PaymentPage from './order/PaymentPage';
// import OrderSummaryPage from './order/OrderSummaryPage';
import OrdersTable from './order/OrdersTable';
import BasketPage from './order/Basket';
import OrderSummary from './order/OrderSummary'

// This is the default content shown at /dashboard


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register-driver" element={<DriverRegisterForm />} />
        <Route path="/login-driver" element={<DriverLoginForm />} />
        <Route path="/trackingMap" element={<TrackingMap />} />
        <Route path="/profile" element={<DriverProfile />} />




        {/* Route for customer */}
        <Route path="/" element={<BiteSpeedHomePage />} />
        <Route path="/customer-login" element={<CustomerLoginForm />} />
        <Route path="/customer-register" element={<CustomerRegisterForm />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
        <Route path="/customer-home" element={<CustomerHome />} />
        <Route path="/restaurant/:id" element={<ViewMenu />} />
        <Route path="/customer-order_tracking" element={<CustomerOrderTracking />} />
        {/* Route for restaurant */}
        <Route path="/register-restaurant" element={<RestaurantRegister />} />


        {/* Route for admin */}
        <Route path="/admin-graph" element={<AdminDashboard />} />

        {/* Dashboard layout with nested routes */}
        <Route path="/dashboard" element={<DriverDashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<DriverProfile />} />
          <Route path="addVehicle" element={<AddVehicle />} />
          <Route path="findOrders" element={<FindOrders />} />
          <Route path="tracking" element={<OrderTracking />} />
        </Route>
        <Route path="/login-restaurant" element={<RestaurantLogin />} />
        <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
        <Route path="/restaurant/profile" element={<RestaurantProfile />} />
        <Route path="/restaurant/menu" element={<MenuManagement />} />
        <Route path="/restaurant/orders" element={<HandleOrders />} />
        
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        {/* <Route path="/ordersummary" element={<OrderSummaryPage />} /> */}
        <Route path="/orderDetails" element={<OrdersTable />} />
        <Route path="/basket" element={<BasketPage />} />
        <Route path="/OrderSummary" element={<OrderSummary />} />
        
      </Routes>
    </Router>
  );
}

export default App;

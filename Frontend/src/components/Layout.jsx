// src/components/Layout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

// what is OUTLET in react-router-dom?
// The `<Outlet />` component in `react-router-dom` is a placeholder that renders the child routes of the current route.
// It allows you to create nested routes and display the corresponding components based on the current URL path.
// When you define a route with child routes, the `<Outlet />` will render the component associated with the matched child route,
// enabling a hierarchical structure in your application.
// This is particularly useful for layouts where you want to maintain a consistent structure (like headers, footers,
// or sidebars) while changing the content dynamically based on the route.

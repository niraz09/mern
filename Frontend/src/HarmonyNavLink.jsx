import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import { useCart } from "./context/CartContext"
import { STORE_NAME } from "./config"

const HarmonyNavLink = () => {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header>
      <div className="header">
        <div className="container header-inner">
          <Link to="/" className="brand">{STORE_NAME}</Link>
          <nav className="nav">
            <NavLink to="/guitar">Buy</NavLink>
            <NavLink to="/sell">Sell</NavLink>
            <NavLink to="/cart">Cart ({count})</NavLink>
            {user ? (
              <>
                <NavLink to="/orders">My orders</NavLink>
                <button className="link-button" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <>
                <NavLink to="/login">Log in</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
          </nav>
        </div>
      </div>
      {user && (
        <div className="admin-bar">
          <div className="container header-inner">
            <span className="muted">Hi, {user.name}</span>
            <nav className="nav">
              <NavLink to="/my-guitars">My listings</NavLink>
              <NavLink to="/sales">My sales</NavLink>
              {user.role === "admin" && (
                <>
                  <NavLink to="/admin/guitar">All guitars</NavLink>
                  <NavLink to="/admin/order">All orders</NavLink>
                  <NavLink to="/admin/user">Users</NavLink>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default HarmonyNavLink

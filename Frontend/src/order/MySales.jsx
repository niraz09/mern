import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import api, { errMsg } from "../api"
import { formatDate, money } from "../config"

// orders for the guitars the logged in user is selling
const MySales = () => {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/order/sales")
      .then((res) => setSales(res.data.result))
      .catch((error) => toast.error(errMsg(error)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="container page muted">Loading...</div>

  return (
    <div className="container page">
      <h1>My sales</h1>
      {sales.length === 0 ? (
        <p>No sales yet. <Link to="/my-guitars">See your listings</Link>.</p>
      ) : (
        sales.map((s) => (
          <div key={s._id} className="order">
            <div className="between">
              <strong>Order {s._id.slice(-6)}</strong>
              <span className={`status ${s.status}`}>{s.status}</span>
            </div>
            <p className="muted small">Placed on {formatDate(s.createdAt)}</p>
            <table>
              <tbody>
                {s.items.map((i) => (
                  <tr key={i._id}>
                    <td>{i.name} x {i.qty}</td>
                    <td className="right">{money(i.price * i.qty)}</td>
                  </tr>
                ))}
                <tr>
                  <td><strong>You earn</strong></td>
                  <td className="right"><strong>{money(s.total)}</strong></td>
                </tr>
              </tbody>
            </table>
            <p className="muted small">Deliver to {s.shipping.name}, {s.shipping.phone}, {s.shipping.address}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default MySales

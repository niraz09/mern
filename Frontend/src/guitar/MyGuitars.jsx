import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import api, { errMsg } from "../api"
import { money } from "../config"

// the guitars the logged in user is selling
const MyGuitars = () => {
  const [guitars, setGuitars] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    api.get("/guitar/mine")
      .then((res) => setGuitars(res.data.result))
      .catch((error) => toast.error(errMsg(error)))
      .finally(() => setLoading(false))
  }, [refresh])

  const handleDelete = async (guitar) => {
    if (!window.confirm(`Remove "${guitar.name}" from sale? This can't be undone.`)) return
    try {
      await api.delete(`/guitar/${guitar._id}`)
      toast.success("Listing removed")
      setRefresh((n) => n + 1)
    } catch (error) {
      toast.error(errMsg(error))
    }
  }

  return (
    <div className="container page">
      <div className="between">
        <h1>My listings</h1>
        <button className="btn" onClick={() => navigate("/sell")}>Sell a guitar</button>
      </div>

      {loading ? (
        <p className="muted">Loading...</p>
      ) : guitars.length === 0 ? (
        <p>You aren't selling anything yet. <Link to="/sell">List your first guitar</Link>.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Guitar</th><th>Type</th><th>Condition</th><th>Price</th><th>In stock</th><th></th></tr>
            </thead>
            <tbody>
              {guitars.map((g) => (
                <tr key={g._id}>
                  <td><Link to={`/guitar/${g._id}`}>{g.brand} {g.name}</Link></td>
                  <td>{g.type}</td>
                  <td>{g.condition}</td>
                  <td>{money(g.price)}</td>
                  <td>{g.quantity > 0 ? g.quantity : "Sold"}</td>
                  <td className="actions">
                    <Link to={`/sell/edit/${g._id}`}>Edit</Link>
                    <button className="link-button danger" onClick={() => handleDelete(g)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MyGuitars

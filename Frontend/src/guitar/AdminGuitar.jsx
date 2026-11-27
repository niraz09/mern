import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import api, { errMsg } from "../api"
import { money } from "../config"

// admin: every guitar on the site, from every seller
const AdminGuitar = () => {
  const [guitars, setGuitars] = useState([])
  const [loading, setLoading] = useState(true)

  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    api.get("/guitar", { params: { limit: 48 } })
      .then((res) => setGuitars(res.data.result))
      .catch((error) => toast.error(errMsg(error)))
      .finally(() => setLoading(false))
  }, [refresh])

  const handleDelete = async (guitar) => {
    if (!window.confirm(`Delete "${guitar.name}"? This can't be undone.`)) return
    try {
      await api.delete(`/guitar/${guitar._id}`)
      toast.success("Guitar deleted")
      setRefresh((n) => n + 1)
    } catch (error) {
      toast.error(errMsg(error))
    }
  }

  return (
    <div className="container page">
      <h1>All guitars</h1>

      {loading ? (
        <p className="muted">Loading...</p>
      ) : guitars.length === 0 ? (
        <p>No guitars listed yet.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Guitar</th><th>Type</th><th>Seller</th><th>Price</th><th>In stock</th><th></th></tr>
            </thead>
            <tbody>
              {guitars.map((g) => (
                <tr key={g._id}>
                  <td><Link to={`/guitar/${g._id}`}>{g.brand} {g.name}</Link></td>
                  <td>{g.type}</td>
                  <td>{g.seller?.name || "-"}</td>
                  <td>{money(g.price)}</td>
                  <td>{g.quantity}</td>
                  <td className="actions">
                    <Link to={`/sell/edit/${g._id}`}>Edit</Link>
                    <button className="link-button danger" onClick={() => handleDelete(g)}>Delete</button>
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

export default AdminGuitar

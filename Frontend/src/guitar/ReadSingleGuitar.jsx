import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import api, { errMsg } from "../api"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { money } from "../config"

const ReadSingleGuitar = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { add } = useCart()
  const [guitar, setGuitar] = useState(null)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    api.get(`/guitar/${id}`)
      .then((res) => setGuitar(res.data.result))
      .catch((error) => {
        toast.error(errMsg(error))
        navigate("/guitar")
      })
  }, [id, navigate])

  if (!guitar) return <div className="container page muted">Loading...</div>

  const inStock = guitar.quantity > 0
  const isMine = user && guitar.seller?._id === user._id
  const canEdit = isMine || user?.role === "admin"

  const handleAdd = () => {
    add(guitar, qty)
    toast.success(`${guitar.name} added to cart`)
  }

  return (
    <div className="container page">
      <p><Link to="/guitar">Back to guitars</Link></p>
      <div className="detail">
        <div className="detail-image">
          <img src={guitar.image || "/guitar.svg"} alt={guitar.name} className={guitar.image ? "" : "placeholder"} />
        </div>
        <div>
          <div className="small muted">{guitar.brand} &middot; {guitar.type}</div>
          <h1>{guitar.name}</h1>
          <p className="price">{money(guitar.price)}</p>
          <p><span className="tag">{guitar.condition}</span></p>
          <p>{guitar.description}</p>
          <p className="muted small">Sold by {guitar.seller?.name || "a Strings&Harmony member"}</p>
          <p className="muted">{inStock ? `${guitar.quantity} available` : "Sold"}</p>

          {inStock && !isMine && (
            <div className="row">
              {guitar.quantity > 1 && (
                <input
                  type="number"
                  min="1"
                  max={guitar.quantity}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Math.min(Number(e.target.value) || 1, guitar.quantity)))}
                  className="qty"
                  aria-label="Quantity"
                />
              )}
              <button className="btn" onClick={handleAdd}>Add to cart</button>
            </div>
          )}

          {isMine && <p className="muted">This is your listing.</p>}
          {canEdit && <p><Link to={`/sell/edit/${guitar._id}`}>Edit this listing</Link></p>}
        </div>
      </div>
    </div>
  )
}

export default ReadSingleGuitar

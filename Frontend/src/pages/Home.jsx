import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import api, { errMsg } from "../api"
import GuitarCard from "../components/GuitarCard"
import { STORE_NAME, TYPES } from "../config"

const Home = () => {
  const [guitars, setGuitarse] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/guitar", { params: { limit: 8 } })
      .then((res) => setGuitars(res.data.result))
      .catch((error) => toast.error(errMsg(error)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container page">
      <section className="intro">
        <h1>{STORE_NAME}</h1>
        <p>A home for guitars and the people who play them. Find your next instrument, or give your old one a new stage. Order online and pay when it arrives.</p>
        <div className="row">
          <Link className="btn" to="/guitar">Browse guitars</Link>
          <Link className="btn secondary" to="/sell">Sell your guitar</Link>
        </div>
      </section>

      <section>
        <h2>Shop by type</h2>
        <div className="row">
          {TYPES.map((t) => (
            <Link key={t} className="btn secondary" to={`/guitar?type=${encodeURIComponent(t)}`}>{t}</Link>
          ))}
        </div>
      </section>

      <section>
        <h2>Newest listings</h2>
        {loading ? (
          <p className="muted">Loading...</p>
        ) : guitars.length === 0 ? (
          <p className="muted">No guitars listed yet. <Link to="/sell">Be the first to sell one</Link>.</p>
        ) : (
          <div className="grid">
            {guitars.map((g) => <GuitarCard key={g._id} guitar={g} />)}
          </div>
        )}
        <p><Link to="/guitar">See all guitars</Link></p>
      </section>
    </div>
  )
}

export default Home

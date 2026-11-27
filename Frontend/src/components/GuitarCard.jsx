import { Link } from "react-router-dom"
import { money } from "../config"

const GuitarCard = ({ guitar }) => {
  return (
    <Link to={`/guitar/${guitar._id}`} className="product">
      <div className="product-image">
        <img src={guitar.image || "/guitar.svg"} alt={guitar.name} className={guitar.image ? "" : "placeholder"} />
      </div>
      <div className="small muted">{guitar.brand} &middot; {guitar.type}</div>
      <div className="product-name">{guitar.name}</div>
      <div>
        {money(guitar.price)}
        {guitar.quantity <= 0 ? <span className="muted"> (sold)</span> : <span className="tag">{guitar.condition}</span>}
      </div>
    </Link>
  )
}

export default GuitarCard

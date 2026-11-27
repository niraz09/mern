import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="container page">
      <h1>Page not found</h1>
      <p>The page you asked for doesn't exist. <Link to="/guitar">Browse guitars</Link>.</p>
    </div>
  )
}

export default NotFound

import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import api, { errMsg } from "../api"
import GuitarCard from "../components/GuitarCard"
import { CONDITIONS, TYPES } from "../config"

// the buy page. search, type, condition, sort and page live in the url so links and the back button work
const ReadAllGuitar = () => {
  const [params, setParams] = useSearchParams()
  const q = params.get("q") || ""
  const type = params.get("type") || ""
  const condition = params.get("condition") || ""
  const sort = params.get("sort") || "newest"
  const page = Number(params.get("page")) || 1

  const [data, setData] = useState({ result: [], total: 0, pages: 1, key: null })
  const [search, setSearch] = useState(q)

  // data remembers which query it belongs to, so we know when a new one is still loading
  const key = `${q}|${type}|${condition}|${sort}|${page}`
  const loading = data.key !== key

  useEffect(() => {
    api.get("/guitar", { params: { q, type, condition, sort, page, limit: 12 } })
      .then((res) => setData({ ...res.data, key }))
      .catch((error) => {
        toast.error(errMsg(error))
        setData({ result: [], total: 0, pages: 1, key })
      })
  }, [q, type, condition, sort, page, key])

  const update = (changes) => {
    const next = new URLSearchParams(params)
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)))
    if (!("page" in changes)) next.delete("page") // a new filter starts from page 1
    setParams(next)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    update({ q: search.trim() })
  }

  return (
    <div className="container page">
      <h1>Buy a guitar</h1>

      <div className="filters">
        <form onSubmit={handleSearch} className="row">
          <input
            type="search"
            placeholder="Search by brand or model"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search guitars"
          />
          <button className="btn">Search</button>
        </form>
        <div className="row">
          <select value={type} onChange={(e) => update({ type: e.target.value })} aria-label="Type">
            <option value="">All types</option>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={condition} onChange={(e) => update({ condition: e.target.value })} aria-label="Condition">
            <option value="">Any condition</option>
            {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sort} onChange={(e) => update({ sort: e.target.value })} aria-label="Sort by">
            <option value="newest">Newest</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="muted">Loading...</p>
      ) : data.result.length === 0 ? (
        <p>No guitars match your search. <button className="link-button" onClick={() => { setSearch(""); setParams({}) }}>Clear filters</button></p>
      ) : (
        <>
          <p className="muted small">{data.total} {data.total === 1 ? "guitar" : "guitars"}</p>
          <div className="grid">
            {data.result.map((g) => <GuitarCard key={g._id} guitar={g} />)}
          </div>
          {data.pages > 1 && (
            <div className="row pager">
              <button className="btn secondary" disabled={page <= 1} onClick={() => update({ page: page - 1 })}>Previous</button>
              <span>Page {page} of {data.pages}</span>
              <button className="btn secondary" disabled={page >= data.pages} onClick={() => update({ page: page + 1 })}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ReadAllGuitar

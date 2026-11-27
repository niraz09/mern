import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CONDITIONS, TYPES } from "../config"

const emptyGuitar = { name: "", brand: "", type: "Acoustic", condition: "Good", price: "", quantity: 1, image: "", description: "" }

// used by both CreateGuitar and UpdateGuitar
const GuitarForm = ({ initial = emptyGuitar, onSave, submitLabel }) => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ ...emptyGuitar, ...initial })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      name: form.name,
      brand: form.brand,
      type: form.type,
      condition: form.condition,
      price: form.price,
      quantity: form.quantity,
      image: form.image,
      description: form.description,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="field-row">
        <div className="field">
          <label htmlFor="brand">Brand</label>
          <input id="brand" name="brand" value={form.brand} onChange={handleChange} placeholder="Yamaha, Fender, Ibanez..." required />
        </div>
        <div className="field">
          <label htmlFor="name">Model name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="FG800" required />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="type">Type</label>
          <select id="type" name="type" value={form.type} onChange={handleChange}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="condition">Condition</label>
          <select id="condition" name="condition" value={form.condition} onChange={handleChange}>
            {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="price">Price (Rs.)</label>
          <input id="price" name="price" type="number" min="0" value={form.price} onChange={handleChange} required />
        </div>
        <div className="field">
          <label htmlFor="quantity">How many do you have?</label>
          <input id="quantity" name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} required />
        </div>
      </div>
      <div className="field">
        <label htmlFor="image">Photo link</label>
        <input id="image" name="image" type="url" value={form.image} onChange={handleChange} placeholder="https://" />
      </div>
      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows="5" value={form.description} onChange={handleChange} placeholder="Age, any marks or repairs, what is included (case, strap...)" />
      </div>
      <div className="row">
        <button className="btn">{submitLabel}</button>
        <button type="button" className="btn secondary" onClick={() => navigate(-1)}>Cancel</button>
      </div>
    </form>
  )
}

export default GuitarForm

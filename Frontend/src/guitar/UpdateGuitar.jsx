import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import api, { errMsg } from "../api"
import GuitarForm from "./GuitarForm"

const UpdateGuitar = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [guitar, setGuitar] = useState(null)

  useEffect(() => {
    api.get(`/guitar/${id}`)
      .then((res) => setGuitar(res.data.result))
      .catch((error) => {
        toast.error(errMsg(error))
        navigate("/my-guitars")
      })
  }, [id, navigate])

  const handleSave = async (data) => {
    try {
      await api.patch(`/guitar/${id}`, data)
      toast.success("Listing updated")
      navigate(-1)
    } catch (error) {
      toast.error(errMsg(error))
    }
  }

  if (!guitar) return <div className="container page muted">Loading...</div>

  return (
    <div className="container page narrow">
      <h1>Edit listing</h1>
      <GuitarForm initial={guitar} onSave={handleSave} submitLabel="Save changes" />
    </div>
  )
}

export default UpdateGuitar

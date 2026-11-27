import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import api, { errMsg } from "../api"
import GuitarForm from "./GuitarForm"

const CreateGuitar = () => {
  const navigate = useNavigate()

  const handleSave = async (data) => {
    try {
      await api.post("/guitar", data)
      toast.success("Your guitar is listed")
      navigate("/my-guitars")
    } catch (error) {
      toast.error(errMsg(error))
    }
  }

  return (
    <div className="container page narrow">
      <h1>Sell a guitar</h1>
      <GuitarForm onSave={handleSave} submitLabel="List guitar" />
    </div>
  )
}

export default CreateGuitar

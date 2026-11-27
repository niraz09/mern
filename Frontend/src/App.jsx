import HarmonyNavLink from "./HarmonyNavLink"
import HarmonyRoute from "./HarmonyRoute"
import { STORE_NAME } from "./config"

const App = () => {
  return (
    <div className="app">
      <HarmonyNavLink />
      <main>
        <HarmonyRoute />
      </main>
      <footer className="footer">
        <div className="container">&copy; {new Date().getFullYear()} {STORE_NAME}. Buy and sell guitars. Payment is cash on delivery.</div>
      </footer>
    </div>
  )
}

export default App

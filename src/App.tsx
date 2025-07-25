import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DishOrderPage from './features/dish-order-page'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/components" element={<div>Component Test Page</div>} />
        <Route path="/dish-order" element={<DishOrderPage />} />
        <Route path="/" element={<DishOrderPage />} />
        <Route path="*" element={<h5>404 Not Found</h5>} />
      </Routes>
      </BrowserRouter>
  )
}

export default App
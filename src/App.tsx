import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DishOrderPage from './features/dish-order-page'
import MenuManagement from './features/menu-management/menu-management'
import Apis from './pages/apis/apis'
import Login from './pages/auth/login'
import Register from './pages/auth/register'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dish-order" element={<DishOrderPage />} />
        <Route path="/" element={<DishOrderPage />} />
        
        {/* 보호된 라우트 */}
        <Route path="/menu-management" element={
          <ProtectedRoute>
            <MenuManagement />
          </ProtectedRoute>
        } />
        <Route path="/apis" element={
          <ProtectedRoute>
            <Apis />
          </ProtectedRoute>
        } />
        
        {/* 기타 */}
        <Route path="/components" element={<div>Component Test Page</div>} />
        <Route path="*" element={<h5>404 Not Found</h5>} />
      </Routes>
      </BrowserRouter>
  )
}

export default App
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes/index.tsx'
import AuthContextProvider from './context/authContext.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import './css/button.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

createRoot(document.getElementById('root')!).render(
  <AuthContextProvider>
    <RouterProvider router={router} />
    <ToastContainer
      position="bottom-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </AuthContextProvider>
)

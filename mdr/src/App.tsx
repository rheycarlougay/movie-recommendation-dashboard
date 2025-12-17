import { BrowserRouter } from 'react-router-dom'
import { ApiProvider } from '@services/ApiContext'
import ToastContainer from '@components/toast/ToastContainer'
import Index from '@components/Index'
import '@css/App.css'

function App() {
  return (
    <ApiProvider>
      <ToastContainer>
        <BrowserRouter>
          <Index />
        </BrowserRouter>
      </ToastContainer>
    </ApiProvider>
  )
}

export default App

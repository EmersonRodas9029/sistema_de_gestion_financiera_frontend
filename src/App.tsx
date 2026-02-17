import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Sistema de Gestión Financiera
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8 text-center text-gray-600">
              ¡Bienvenido al Dashboard! 
              <br />
              <span className="text-sm">La estructura está lista para comenzar a desarrollar</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

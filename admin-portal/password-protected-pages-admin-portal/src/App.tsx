import Portal from './Portal'

function App() {
  return (
    <div className="App relative p-8 h-screen min-h-screen max-w-4xl mx-auto">
      <header
        className="flex justify-between items-baseline text-gray-900 dark:text-white"
      >
        <a
          className="mb-4 text-4xl tracking-tight font-bold hover:underline"
          href=""
        >
          Password Protected Pages: Admin
        </a>
      </header>
      <Portal />
    </div>
  )
}

export default App

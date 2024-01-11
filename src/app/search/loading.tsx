export default () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex items-center justify-center gap-4">
        <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce"></div>
      </div>
      <span className="text-gray-800">Carregando...</span>
      <span className="text-gray-400">Isso pode demorar um pouco</span>
    </div>
  )
}

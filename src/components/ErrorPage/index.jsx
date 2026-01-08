const ErrorPage = () => {
  return (
    <section className="bg-dark">
      <div className="flex flex-col lg:gap-3 gap-1 justify-center align-center text-center mx-auto h-screen">
        <h1 className="lg:text-6xl sm:text-4xl text-3xl font-bold">Error <span className="text-red-500">!</span></h1>
        <p className="lg:text-2xl text-xl font-medium text-gray">Sorry, an unexpected error has occurred.</p>
      </div>
    </section>
  )
}

export default ErrorPage

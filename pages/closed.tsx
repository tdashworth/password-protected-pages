
export default function Closed() {
  return <>
    <section className="bg-white dark:bg-gray-900 h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="py-8 px-4 mx-auto max-w-screen-md text-center lg:py-16 lg:px-12">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mx-auto mb-4 w-16 h-16 text-blue-600 dark:text-blue-500">
            <path fillRule="evenodd" d="M6.72 5.66l11.62 11.62A8.25 8.25 0 006.72 5.66zm10.56 12.68L5.66 6.72a8.25 8.25 0 0011.62 11.62zM5.105 5.106c3.807-3.808 9.98-3.808 13.788 0 3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788z" clipRule="evenodd" />
          </svg>

          <h1 className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Site closed.</h1>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">This site is unavailable. Please contact us if you believe this to be wrong.</p>
        </div>
      </div>
    </section>
  </>
}
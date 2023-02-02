import { useRouter } from 'next/router'

export default function Custom404() {
  const error = useRouter().query['error']

  return <>
    <section className="bg-gray-50 dark:bg-gray-900 h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-64 mr-2" src="https://prod.ucwe.capgemini.com/gb-en/wp-content/themes/capgemini2020/assets/images/logo.svg" alt="logo" />
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Page Locked
            </h1>
            <form className="space-y-4 md:space-y-6" method="get">
              <div>
                <label
                  htmlFor="password"
                  className={`block mb-2 text-sm font-medium ${!error ? 'text-gray-900 dark:text-white' : 'text-red-700 dark:text-red-500'}`}>
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className={`border sm:text-sm rounded-lg block w-full p-2.5 ${!error
                    ? 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-700 focus:border-primary-700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-700 dark:focus:border-primary-700'
                    : 'bg-red-50 border-red-500 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-100 dark:border-red-400 placeholder-red-700'}`}
                  required />

                {error && <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  <span className="font-medium">Oops!</span> {error}
                </p>}
              </div>

              <button
                type="submit"
                className="w-full text-white bg-primary-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-700 dark:hover:bg-primary-700 dark:focus:ring-primary-300">
                Enter
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </>
}
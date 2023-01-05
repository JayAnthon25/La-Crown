import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return(
    <>
    <div className='min-h-screen p-3 bg-gradient-to-b from-green-700 to-white"'>
    <Component {...pageProps} />
    </div>
    </>
  )
}

export default MyApp

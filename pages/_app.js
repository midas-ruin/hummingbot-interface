import { ThemeProvider } from '@hummingbot/hbui/system/ThemeContext'
import GlobalStyles from '@hummingbot/hbui/system/GlobalStyles'

const App = ({ Component, pageProps }) => (
  <ThemeProvider>
    <GlobalStyles />
    <Component {...pageProps} />
  </ThemeProvider>
)

export default App

import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html className="scrollable-element">


<link rel="preconnect" href="https://fonts.googleapis.com"></link>
<link rel="preconnect" href="https://fonts.gstatic.com"></link>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap" rel="stylesheet"></link>
        <Head />
        {/* Must  */}
        
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="KNNYs Market" />
        <meta name="keywords" content="nft, ethereum, protocol" />
        <link rel="shortcut icon" type="image/svg" href="/face.svg" />
        <title>
          KNNYs Market
        </title>
        <meta
          name="description"
          content="KNNYs Market"
        />
        <meta name="keywords" content="NFT, API, Protocol" />
        {/* Twitter */}
        {/* The optimal size is 1200 x 630 (1.91:1 ratio). */}
        <meta
          name="twitter:image"
          content="https://www.reservoir.market/og.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:site:domain"
          content="https://www.reservoir.market/"
        />
        <meta name="twitter:url" content="https://www.reservoir.market/" />
        {/* should be between 30-60 characters, with a maximum of 70 */}
        <meta
          name="twitter:title"
          content="Reservoir Market | Open source NFT marketplace powered by Reservoir Protocol"
        />
        {/* should be between 55 and 200 characters long */}
        <meta
          name="twitter:description"
          content="Reservoir Market is an open source NFT marketplace powered by Reservoir"
        />
        <meta name="twitter:site" content="@reservoir0x" />

        {/* OG - https://ogp.me/ */}
        {/* https://www.opengraph.xyz/ */}
        {/* should be between 30-60 characters, with a maximum of 90 */}
        <meta
          name="og:title"
          content="Reservoir Market | Open source NFT marketplace powered by Reservoir Protocol"
        />
        <meta property="og:type" content="website" />
        <meta property="og:determiner" content="the" />
        <meta property="og:locale" content="en" />
        {/* Make sure the important part of your description is within the first 110 characters, so it doesn't get cut off on mobile. */}
        <meta
          property="og:description"
          content="Reservoir Market is an open source NFT marketplace powered by Reservoir"
        />
        <meta property="og:site_name" content="Reservoir Market" />
        <meta property="og:url" content="https://www.reservoir.market/" />
        {/* The optimal size is 1200 x 630 (1.91:1 ratio). */}
        <meta
          property="og:image"
          content="https://www.reservoir.market/og.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="640" />
        <meta property="og:image:alt" content="Reservoir Market banner" />
        <body className="background text">
          <Main />
          <NextScript />
          
        </body>
      </Html>
    )
  }
}

export default MyDocument

import React from 'react'

import { useInstagramGallery } from 'use-instagram-gallery'

import 'use-instagram-gallery'

const App = () => {
  const { init, gallery, status } = useInstagramGallery({
    username: '_tanshio_',
  })
  React.useEffect(() => {
    init()
  }, [])
  return (
    <div>
      <div>{status}</div>
      {gallery.map((media) => {
        return (
          <div key={media.url}>
            <a href={media.url} rel={'noopener'} target={'_blank'}>
              <img src={media.src} alt={media.alt} />
            </a>
          </div>
        )
      })}
    </div>
  )
}
export default App

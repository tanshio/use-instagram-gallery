import React from 'react'

import { useMyHook } from 'use-instagram-gallery'

const App = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
export default App

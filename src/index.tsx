import { useCallback, useState } from 'react'

const INSTAGRAM_URL = 'https://www.instagram.com'

type StatusType = 'LOADING' | 'SUCCESS' | 'FAILED'

interface InstagramMedia {
  accessibility_caption: string
  dimensions: { height: number; width: number }
  display_url: string
  edge_media_to_caption: {
    edges: {
      node: {
        text: string
      }
    }[]
  }
  shortcode: string
  thumbnail_resources: {
    src: string
    config_height: number
    config_width: number
  }[]
  thumbnail_src: string
}

interface InstagramNode {
  node: InstagramMedia
}

interface InstagramProfile {
  graphql: {
    user: {
      edge_owner_to_timeline_media: {
        count: number
        edges: InstagramNode[]
      }
    }
  }
}

interface Instagram {
  entry_data: {
    ProfilePage: InstagramProfile[]
  }
}

interface Media {
  src: string
  alt: string
  url: string
  original: InstagramMedia
}

const format = (parseData: Instagram): Media[] => {
  try {
    const timeline =
      parseData.entry_data.ProfilePage[0].graphql.user
        .edge_owner_to_timeline_media.edges
    return timeline.map((media) => {
      return {
        alt: media.node.accessibility_caption,
        src: media.node.thumbnail_src,
        url: `${INSTAGRAM_URL}/p/${media.node.shortcode}`,
        original: media.node,
      }
    })
  } catch (e) {
    throw Error(`Can't format data`)
  }
}

const parse = (body: string) => {
  try {
    const data = body.split('window._sharedData = ')[1].split('</script>')[0]
    return JSON.parse(data.substr(0, data.length - 1)) as Instagram
  } catch (err) {
    throw Error(`Can't parse body`)
  }
}

const fetchInstagram = async (username: string) => {
  try {
    const url = `https://images${~~(
      Math.random() * 3333
    )}-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=${INSTAGRAM_URL}/${username}/`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Can't fetch instagram`)
    }
    return await res.text()
  } catch (e) {
    throw new Error(`Can't fetch instagram`)
  }
}

export const useInstagramGallery = (props: { username: string }) => {
  const [gallery, setGallery] = useState<Media[]>([])
  const [status, setStatus] = useState<StatusType>('LOADING')

  const init = useCallback(async () => {
    setStatus('LOADING')
    try {
      const json = await fetchInstagram(props.username)
      const parsedData = parse(json)
      setGallery(format(parsedData))
      setStatus('SUCCESS')
    } catch (e) {
      setStatus('FAILED')
      throw new Error(e)
    }
  }, [props.username])

  return { gallery, status, init }
}

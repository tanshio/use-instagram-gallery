import { useInstagramGallery } from './'
import { HookResult, renderHook, act } from '@testing-library/react-hooks'
import fetchMock from 'jest-fetch-mock'
import { expected, html } from './instagram.mock'

fetchMock.enableMocks()

describe('useMyHook', () => {
  let result: HookResult<ReturnType<typeof useInstagramGallery>>
  beforeEach(() => {
    result = renderHook(() => useInstagramGallery({ username: 'tanshio' }))
      .result
  })

  it('Successful fetch', async () => {
    fetchMock.mockResponse(html)
    await act(async () => {
      await result.current.init()
      const { url, alt, src } = result.current.gallery[0]
      expect({ alt, url, src }).toStrictEqual(expected)
    })
  })

  it('failed to fetch', async () => {
    fetchMock.mockResponse(`<html></html>`)
    await act(async () => {
      try {
        await result.current.init()
      } catch (e) {}
      const status = result.current.status
      expect(status).toStrictEqual('FAILED')
    })
  })
})

import { act, renderHook } from '@testing-library/react'
import { useAlarmSound } from '@/hooks/useAlarmSound'

beforeEach(()=>{localStorage.clear();jest.useFakeTimers()})
afterEach(()=>{jest.useRealTimers();jest.restoreAllMocks()})
it('stops the alarm and its preview immediately and cancels the preview timer',()=>{
  const play = jest.spyOn(HTMLMediaElement.prototype,'play').mockResolvedValue()
  const pause = jest.spyOn(HTMLMediaElement.prototype,'pause').mockImplementation(()=>{})
  const {result,unmount}=renderHook(()=>useAlarmSound())
  act(()=>result.current.playSound())
  expect(play).toHaveBeenCalledTimes(1)
  act(()=>result.current.previewSound())
  expect(play).toHaveBeenCalledTimes(2)
  const before=pause.mock.calls.length
  act(()=>result.current.stopSound())
  expect(pause.mock.calls.length).toBeGreaterThan(before)
  const stopped=pause.mock.calls.length
  act(()=>jest.advanceTimersByTime(2500))
  expect(pause).toHaveBeenCalledTimes(stopped)
  unmount()
})

it.each(['submarine', 'fire-alert'] as const)('previews and remembers the %s alarm', sound => {
  let playedSource: string | null = null
  jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function(this: HTMLMediaElement) {
    playedSource = this.getAttribute('src')
    return Promise.resolve()
  })
  jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  const first = renderHook(() => useAlarmSound())
  act(() => first.result.current.changeSound(sound))
  act(() => first.result.current.previewSound())
  expect(playedSource).toBe(`/sounds/${sound}.wav`)
  expect(localStorage.getItem('phoneLunkAlarmSound')).toBe(sound)
  first.unmount()
  const second = renderHook(() => useAlarmSound())
  expect(second.result.current.selectedSound).toBe(sound)
  second.unmount()
})

it('defaults to Submarine without overriding a saved sound', () => {
  const fresh = renderHook(() => useAlarmSound())
  expect(fresh.result.current.selectedSound).toBe('submarine')
  fresh.unmount()
  localStorage.setItem('phoneLunkAlarmSound', 'fire-alert')
  const saved = renderHook(() => useAlarmSound())
  expect(saved.result.current.selectedSound).toBe('fire-alert')
  saved.unmount()
})

it('mutes playback and restores the previous volume on unmute', () => {
  jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
  const pause = jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  const {result} = renderHook(() => useAlarmSound())
  act(() => result.current.changeVolume(.4))
  act(() => result.current.previewSound())
  act(() => result.current.toggleMute())
  expect(result.current.isMuted).toBe(true)
  expect(result.current.volume).toBe(0)
  expect(pause).toHaveBeenCalled()
  act(() => result.current.toggleMute())
  expect(result.current.isMuted).toBe(false)
  expect(result.current.volume).toBe(.4)
})

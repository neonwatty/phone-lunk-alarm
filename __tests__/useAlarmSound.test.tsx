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

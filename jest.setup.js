import '@testing-library/jest-dom'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock navigator.mediaDevices for camera testing
const mockMediaStream = {
  getTracks: jest.fn().mockReturnValue([
    {
      stop: jest.fn(),
      kind: 'video',
      label: 'Mock Camera',
    },
  ]),
  getVideoTracks: jest.fn().mockReturnValue([
    {
      stop: jest.fn(),
      kind: 'video',
      label: 'Mock Camera',
    },
  ]),
}

Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: jest.fn().mockResolvedValue(mockMediaStream),
    enumerateDevices: jest.fn().mockResolvedValue([
      {
        deviceId: 'mock-camera-1',
        kind: 'videoinput',
        label: 'Mock Front Camera',
      },
      {
        deviceId: 'mock-camera-2',
        kind: 'videoinput',
        label: 'Mock Back Camera',
      },
    ]),
  },
})

// Mock HTMLCanvasElement.getContext for canvas drawing
const mockCanvas2DContext = {
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  strokeRect: jest.fn(),
  fillText: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  fill: jest.fn(),
  arc: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  scale: jest.fn(),
  translate: jest.fn(),
  rotate: jest.fn(),
}

const originalGetContext = HTMLCanvasElement.prototype.getContext

HTMLCanvasElement.prototype.getContext = jest.fn(function (contextType, ...args) {
  if (contextType === '2d') {
    return mockCanvas2DContext
  }
  if (contextType === 'webgl' || contextType === 'experimental-webgl') {
    // Mock WebGL context for TensorFlow.js
    return {
      canvas: this,
      drawingBufferWidth: 640,
      drawingBufferHeight: 480,
      getParameter: jest.fn(),
      getExtension: jest.fn(),
      createBuffer: jest.fn(),
      bindBuffer: jest.fn(),
      bufferData: jest.fn(),
    }
  }
  return originalGetContext?.call(this, contextType, ...args)
})

// Mock HTMLVideoElement properties for video stream testing
Object.defineProperty(HTMLVideoElement.prototype, 'readyState', {
  writable: true,
  value: 4, // HAVE_ENOUGH_DATA
})

Object.defineProperty(HTMLVideoElement.prototype, 'videoWidth', {
  writable: true,
  value: 640,
})

Object.defineProperty(HTMLVideoElement.prototype, 'videoHeight', {
  writable: true,
  value: 480,
})

// Export mock references for use in tests
global.mockMediaStream = mockMediaStream
global.mockCanvas2DContext = mockCanvas2DContext

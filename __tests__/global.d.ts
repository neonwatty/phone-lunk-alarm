// Type declarations for global test variables

declare global {
  var mockWebcamErrorCallback: ((err: any) => void) | undefined
  var mockWebcamConstraints: { facingMode?: string } | undefined
  var mockMediaStream: {
    getTracks: jest.Mock
    getVideoTracks: jest.Mock
  }
  var mockCanvas2DContext: {
    clearRect: jest.Mock
    fillRect: jest.Mock
    strokeRect: jest.Mock
    fillText: jest.Mock
    beginPath: jest.Mock
    moveTo: jest.Mock
    lineTo: jest.Mock
    stroke: jest.Mock
    fill: jest.Mock
    arc: jest.Mock
    save: jest.Mock
    restore: jest.Mock
    scale: jest.Mock
    translate: jest.Mock
    rotate: jest.Mock
  }
}

export {}

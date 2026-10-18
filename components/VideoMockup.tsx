import { BellAlertIcon } from '@heroicons/react/24/outline'

const exampleUrl = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/examples/phone-lunk-1.gif`

export default function VideoMockup() {
  return (
    <figure className="detector-preview" aria-label="Recorded phone detection example">
      <div className="preview-example-alert"><BellAlertIcon aria-hidden="true" /><span>PHONE LUNK DETECTED</span><BellAlertIcon aria-hidden="true" /></div>
      <div className="preview-viewfinder preview-alarm-example">
        {/* Keep the original landing-page GIF; this alert illustrates the camera flow. */}
        <img src={exampleUrl} width={480} height={270}
          alt="A person sitting on gym equipment while using a phone"
          className="preview-footage" />
      </div>
    </figure>
  )
}

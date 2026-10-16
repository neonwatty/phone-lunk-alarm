const steps = [
  { title: 'Open the camera.', description: 'Launch the detector and allow camera access in your browser.' },
  { title: 'Point toward a phone.', description: 'Keep the phone in view. Detection runs directly on your device.' },
  { title: 'Hear the alarm.', description: 'When a phone is detected, an alarm sounds on your device.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="landing-steps landing-width">
      <div className="section-heading"><p className="landing-eyebrow">HOW IT WORKS</p><h2>Three steps. One clear signal.</h2></div>
      <ol>{steps.map((step, index) => <li key={step.title}><span className="step-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
    </section>
  )
}

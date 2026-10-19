const steps = [
  { title: 'Open the app.', description: 'Launch Phone Lunk and start your camera.' },
  { title: 'Point at a lunk.', description: 'Aim at their phone. Keep it in view.' },
  { title: 'Put em on blast.', description: 'Phone detected. The alarm sounds on your device.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="landing-screen landing-steps-screen" aria-labelledby="how-it-works-title">
      <div className="landing-steps landing-width">
      <div className="section-heading"><h2 id="how-it-works-title">Catch phone lunks in the act.</h2></div>
      <ol>{steps.map((step, index) => <li key={step.title}><span className="step-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
      </div>
    </section>
  )
}

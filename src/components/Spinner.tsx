import * as React from 'react'

interface SpinnerProps {
  text?: string
  size?: string
}

const Spinner: React.FC<SpinnerProps> = ({ text = '', size = '5em' }) => {
  const header = text ? <h4>{text}</h4> : null
  return (
    <div className="spinner">
      {header}
      <div className="loader" style={{ height: size, width: size }} />
    </div>
  )
}

export default Spinner

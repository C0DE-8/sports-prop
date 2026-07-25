import { FaCircleCheck, FaCircleInfo, FaTriangleExclamation, FaXmark } from 'react-icons/fa6'
import styles from './Toast.module.css'

const icons = {
  error: FaTriangleExclamation,
  success: FaCircleCheck,
  info: FaCircleInfo,
}

function Toast({ message, tone = 'error', title, onClose }) {
  if (!message) return null

  const Icon = icons[tone] || icons.info

  return (
    <div className={`${styles.toast} ${styles[tone] || styles.info}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon className={styles.icon} />
      <div className={styles.copy}>
        {title ? <strong>{title}</strong> : null}
        <span>{message}</span>
      </div>
      {onClose ? (
        <button className={styles.close} type="button" onClick={onClose} aria-label="Dismiss alert">
          <FaXmark />
        </button>
      ) : null}
    </div>
  )
}

export default Toast

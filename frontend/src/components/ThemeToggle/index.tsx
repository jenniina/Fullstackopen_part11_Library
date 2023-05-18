import styles from './themetoggle.module.css'

interface toggleProps {
  lightTheme: boolean
  toggleTheme: React.EffectCallback | undefined
}
function ThemeToggle({ lightTheme, toggleTheme }: toggleProps) {
  return (
    <div
      className={`${styles['dlt-theme-toggle-wrap']} ${lightTheme ? styles.light : ''}`}
    >
      <label className='screen-reader-text' htmlFor='dlt-btn'>
        {lightTheme ? 'Dark Mode' : 'Light Mode'}
      </label>
      <button
        id='dlt-btn'
        className={
          lightTheme ? `${styles['dlt-btn']}` : `${styles['active']} ${styles['dlt-btn']}`
        }
        onClick={toggleTheme}
      >
        <div className={`${styles['dlt-inner-wrapper']}`}>
          <div className={`${styles['dlt-btn-inner-left']}`}>
            <div className={`${styles['dlt-innermost']}`}>
              <span className='screen-reader-text'>
                {lightTheme ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}

export default ThemeToggle

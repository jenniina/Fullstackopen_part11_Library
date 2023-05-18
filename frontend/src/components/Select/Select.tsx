import { useEffect, useRef, useState } from 'react'
import styles from './select.module.css'
// import { v4 as uuidv4 } from 'uuid'

export type SelectOption = {
  label: string | null | undefined
  value: string | number | null | undefined
}

type MultipleSelectProps = {
  multiple: true
  value: SelectOption[]
  onChange: (value: SelectOption[]) => void
}

type SingleSelectProps = {
  multiple?: false
  value?: SelectOption | null
  onChange: (value: SelectOption | undefined) => void
}

type SelectProps = {
  instructions: string
  hide?: boolean
  id: string
  className: string
  options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps)

let debounceTimeout: NodeJS.Timeout
let searchTerm = ''

export function Select({
  instructions,
  hide,
  id,
  className,
  multiple,
  value,
  onChange,
  options,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const ariaLive = useRef<HTMLLabelElement>(null)

  function clearOptions(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault()
    return multiple ? onChange([]) : onChange(options[0])
  }

  function selectOption(option: SelectOption) {
    let reset: boolean = true
    const cooldown = () => {
      reset = true
    }
    if (multiple) {
      if (value.includes(option) && reset) {
        reset = false
        onChange(value.filter((o) => o !== option))
        setTimeout(cooldown, 200)
      } else if (reset) {
        reset = false
        onChange([...value, option])
      }
    } else {
      if (option !== value) onChange(option)
    }
  }

  function isOptionSelected(option: SelectOption) {
    return multiple ? value.includes(option) : option === value
  }

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0)
  }, [isOpen])

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.target !== containerRef.current) return
      switch (e.code) {
        case 'Enter':
        case 'Space':
          e.preventDefault()
          if (isOpen) selectOption(options[highlightedIndex])
          else setIsOpen(true)
          break
        case 'ArrowUp':
        case 'ArrowDown': {
          e.preventDefault()
          if (!isOpen) {
            setIsOpen(true)
            break
          }
          const newValue = highlightedIndex + (e.code === 'ArrowDown' ? 1 : -1)
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue)
          }
          break
        }
        case 'Escape':
          e.preventDefault()
          setIsOpen(false)
          containerRef.current?.blur()
          break
        case 'Tab':
          break
        default:
          e.preventDefault()
          clearTimeout(debounceTimeout)
          searchTerm += e.key
          debounceTimeout = setTimeout(() => {
            searchTerm = ''
          }, 600)
          const searchedOption = options.find((option: SelectOption) => {
            return option?.label?.toLowerCase().startsWith(searchTerm)
          })

          if (searchedOption) {
            //selectOption(options[options.indexOf(searchedOption)])
            setHighlightedIndex(options.indexOf(searchedOption))
          }
      }
    }
    containerRef.current?.addEventListener('keydown', keyHandler)

    return () => {
      containerRef.current?.removeEventListener('keydown', keyHandler)
    }
  }, [isOpen, highlightedIndex, options])

  return (
    <>
      <label
        id={`
                ${id}-instructions 
                ${styles[`${id}-instructions`]}`}
        className={`
                ${id}-instructions 
                ${styles[`${id}-instructions`]} 
                ${styles.instructions}
                ${hide ? 'screen-reader-text' : ''}`}
      >
        {instructions}
      </label>
      <div
        role='combobox'
        aria-labelledby={`${id}-instructions`}
        aria-controls={id}
        aria-expanded={isOpen}
        aria-activedescendant={`${id}-${highlightedIndex}`}
        ref={containerRef}
        onBlur={() => setIsOpen(false)}
        onClick={(e) => {
          e.preventDefault() //to stop from occasionally running selectOption(option) twice, immediately unselecting the option
          setIsOpen((prev) => !prev)
        }}
        tabIndex={0}
        className={
          multiple
            ? `${styles.multiple} ${styles.container} ${className}`
            : `${styles.container} ${className}`
        }
      >
        <label className='screen-reader-text' aria-live='polite' ref={ariaLive}></label>
        <span className={styles.value}>
          {multiple
            ? value.map((v) => (
                <button
                  type='button'
                  key={v.value}
                  onClick={(e) => {
                    e.stopPropagation()
                    selectOption(v)
                  }}
                  onKeyUp={(e) => {
                    switch (e.code) {
                      case 'Enter':
                      case 'Space':
                        e.preventDefault()
                        setIsOpen(false)
                        selectOption(v)
                        if (ariaLive.current)
                          ariaLive.current.textContent = `removed ${v.label}`
                        setTimeout(() => {
                          if (ariaLive.current) ariaLive.current.textContent = ''
                        }, 500)
                        if (containerRef.current) containerRef.current.focus()
                        break
                      case 'ArrowUp':
                      case 'ArrowDown': {
                        e.preventDefault()
                        if (!isOpen) {
                          setIsOpen(true)
                          break
                        }
                        break
                      }
                      case 'Escape':
                        e.preventDefault()
                        setIsOpen(false)
                        containerRef.current?.blur()
                        break
                      case 'Tab':
                        break
                      default:
                    }
                  }}
                  className={styles['option-btn']}
                >
                  {v?.label}
                  <span aria-hidden='true' className={`${styles['remove-btn']}`}>
                    &times;
                  </span>
                  <span className='screen-reader-text'>remove</span>
                </button>
              ))
            : value?.label}
        </span>
        {multiple ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              clearOptions(e)
            }}
            className={styles['clear-btn']}
          >
            <span aria-hidden='true'>&times;</span>
            <span className='screen-reader-text'>clear chosen options</span>
          </button>
        ) : (
          ''
        )}

        <div className={styles.caret}></div>
        <ul
          id={id}
          aria-label='options'
          role='listbox'
          aria-multiselectable={multiple ? 'true' : 'false'}
          aria-expanded={isOpen}
          aria-labelledby={`${id}-instructions`}
          className={`${styles.options} ${isOpen ? styles.show : ''}`}
        >
          {options.map((option, index) => (
            <li
              role='option'
              aria-selected={isOptionSelected(option) ? 'true' : 'false'}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault() //to stop from occasionally running selectOption(option) twice, immediately unselecting the option
                selectOption(option)
                setIsOpen(false)
              }}
              onPointerEnter={() => setHighlightedIndex(index)}
              key={option.value}
              className={`${styles.option} ${
                isOptionSelected(option) ? styles.selected : ''
              } ${index === highlightedIndex ? styles.highlighted : ''}`}
              // id={`${id}-${(option.label).replace(/\s+/g, '-').toLowerCase()}-${index}`}
              id={`${id}-${index}`}
            >
              <input
                multiple
                id={`${id}-${option.label?.replace(/\s+/g, '-').toLowerCase()}`}
                type='checkbox'
                className='screen-reader-text'
                value={option?.label ? option?.label : ''}
                name={`${id}-${option.label
                  ?.replace(/\s+/g, '-')
                  .toLowerCase()}-${index}`}
                checked={isOptionSelected(option) ? true : false}
                readOnly
              />
              <label
                htmlFor={`${id}-${option.label?.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {option?.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

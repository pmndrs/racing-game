import { useState, useCallback, useEffect } from 'react'

import type { HTMLAttributes } from 'react'

import type { Key } from '../store'

import { useStore } from '../store'

function Row({
  action,
  keys,
  hasError,
  onRemove,
  onAdd,
}: {
  action: string
  keys: Key[]
  hasError: boolean
  onAdd: (action: string) => void
  onRemove: (action: string, name: string) => void
}): JSX.Element {
  return (
    <div className={`keys-row popup-item${hasError ? ' with-error' : ''}`}>
      <div>{action}</div>
      <div className="popup-item-keys">
        {keys.map(({ name }) => (
          <button
            key={name}
            onClick={() => {
              onRemove(action, name)
            }}
            className="key-button popup-item-key"
          >
            <span>{name}</span>
          </button>
        ))}
        <button
          className="add-button popup-item-key hovered-item"
          onClick={() => {
            onAdd(action)
          }}
        >
          <span>+</span>
        </button>
      </div>
    </div>
  )
}

function Rows({ onSelect }: { onSelect: (action: string) => void }) {
  const [keyboardBindingsList, removeKeyBinding, keyBindingsWithError] = useStore((state) => [
    state.keyboardBindings,
    state.actions.removeKeyBinding as (action: string, name: string) => void,
    state.keyBindingsWithError,
  ])

  const addClickHandler = useCallback((action) => {
    onSelect(action)
  }, [])

  return (
    <>
      {keyboardBindingsList.map(({ keys, action }, index) => (
        <Row key={action} action={action} keys={keys} onRemove={removeKeyBinding} onAdd={addClickHandler} hasError={keyBindingsWithError.includes(index)} />
      ))}
    </>
  )
}

const keyMap: Record<string, string> = {
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Tab: 'Tab ⇥',
  CapsLock: 'CapsLock ⇪',
  ShiftLeft: 'Shift ⇧',
  ShiftRight: 'Shift ⇧',
  ControlLeft: 'Control ⌃',
  ControlRight: 'Control ⌃',
  AltLeft: 'Alt ⌥',
  AltRight: 'Alt ⌥',
  MetaLeft: 'Meta ⌘',
  MetaRight: 'Meta ⌘',
  Space: 'Space ␣',
  Enter: 'Enter ↵',
  Backspace: 'Backspace ⌫',
  Escape: 'Esc ⎋',
}

const codesAlternativesList: Record<string, string[]> = {
  ShiftLeft: ['ShiftLeft', 'ShiftRight'],
  ShiftRight: ['ShiftLeft', 'ShiftRight'],
  ControlLeft: ['ControlLeft', 'ControlRight'],
  ControlRight: ['ControlLeft', 'ControlRight'],
  AltLeft: ['AltLeft', 'AltRight'],
  AltRight: ['AltLeft', 'AltRight'],
}

function populateCodes(code: string): string[] {
  const codes = codesAlternativesList[code]
  return codes ? codes : [code]
}

function getKeyName(key: string, code: string): string {
  const value = keyMap[code]
  return value ? value : key.toUpperCase()
}

function produceKeyFromCode(key: string, code: string): Key {
  return { name: getKeyName(key, code), values: populateCodes(code) }
}

function Modal({ onSelect }: { onSelect: (event: KeyboardEvent) => void }) {
  useEffect(() => {
    window.addEventListener('keydown', onSelect, { passive: true })

    return () => {
      window.removeEventListener('keydown', onSelect)
    }
  }, [onSelect])

  return (
    <div className="key-input-wrapper">
      <div className="key-input">Press new key</div>
    </div>
  )
}

type KeyProps = HTMLAttributes<HTMLDivElement>

export function Keys(props: KeyProps): JSX.Element {
  const [addKeyBinding] = useStore((state) => [state.actions.addKeyBinding as (action: string, newKey: Key) => void])
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  const selectActionHandler = useCallback((action) => {
    setSelectedAction(action)
  }, [])

  const selectKeyHandler = useCallback(
    (event: KeyboardEvent) => {
      const { key, code } = event
      addKeyBinding(selectedAction!, produceKeyFromCode(key, code))
      setSelectedAction(null)
    },
    [selectedAction],
  )

  return (
    <>
      <div {...props}>
        <Rows onSelect={selectActionHandler} />
      </div>
      {selectedAction && <Modal onSelect={selectKeyHandler} />}
    </>
  )
}

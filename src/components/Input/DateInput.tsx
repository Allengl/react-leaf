import { usePopup } from '../../hooks/usePopup'
import { time } from '../../lib/time'
import { Datepicker } from '../Datepiker'

type Props = {
  value?: string
  onChange?: (v: string) => void
  className?: string
  placeholder?: string
  model?: string
}
export const DateInput: React.FC<Props> = (props) => {
  const { value, onChange, className, placeholder, model } = props
  const { toggle, popup, hide } = usePopup({
    children: <Datepicker
      model={model}
      onConfirm={d => { onChange?.(time(d).format()); hide() }}
      onCancel={() => hide()} />
  })

  return (
    <>
      {popup}
      <input className={className} j-input-text type="text" readOnly data-xxxx
        placeholder={placeholder} value={time(value).format()} onClick={toggle} />
    </>
  )
}

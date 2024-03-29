import type { FormEventHandler } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { AxiosError } from 'axios'
import { Gradient } from '../components/Gradient'
import { Icon } from '../components/Icon'
import { TopNav } from '../components/TopNav'
import { useAjax } from '../lib/ajax'
import type { FormError } from '../lib/validate'
import { hasError, validate } from '../lib/validate'
import { useSignInStore } from '../stores/useSignInStore'
import { Input } from '../components/Input'

export const SignInPage: React.FC = () => {
  const { data, error, setData, setError } = useSignInStore()
  const nav = useNavigate()
  const onSubmitError = (err: AxiosError<{
    errors: FormError<typeof data>
  }>) => {
    setError(err.response?.data?.errors ?? {})
    throw error
  }
  const [search] = useSearchParams()
  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const newError = validate(data, [
      { key: 'email', type: 'required', message: '请输入邮箱地址' },
      { key: 'email', type: 'pattern', regex: /^.+@.+$/, message: '邮箱地址格式不正确' },
      { key: 'code', type: 'required', message: '请输入验证码' },
      { key: 'code', type: 'length', min: 6, max: 6, message: '验证码必须是6个字符' },
    ])
    setError(newError)
    if (!hasError(newError)) {
      // 发送请求
      const response = await post<{ jwt: string }>('/api/v1/session', data)
        .catch(onSubmitError)

      // 获取 JWT
      const jwt = response.data.jwt
      // JWT 放入 LS
      localStorage.setItem('jwt', jwt)

      // 回到首页
      const from = search.get('from') || '/items'
      nav(from)
    }
  }
  const { post } = useAjax({ showLoading: true })

  const sendSmsCode = async () => {
    const newError = validate({ email: data.email }, [
      { key: 'email', type: 'pattern', regex: /^.+@.+$/, message: '邮箱地址格式不正确' }
    ])
    setError(newError)
    if (hasError(newError)) { throw new Error('表单出错') }
    const response = await post('/api/v1/validation_codes', {
      email: data.email
    })
    return response
  }

  return (
    <>
      <Gradient>
        <TopNav title="登录" icon={
          <Icon name="back" className='w-24px h-24px' />
        } />
      </Gradient>
      <div text-center pt-40px pb-16px>
        <Icon name="logo" className='w-64px h-68px' />
        <h1 text-32px text="#77dbcf" font-bold>叶子记账</h1>
      </div>
      <div color='#999' m-l-16px m-b-4px >体验账号，可直接登录</div>
      <form j-form onSubmit={onSubmit}>
        <Input label='邮箱地址' type='text' placeholder='请输入邮箱，然后点击发送验证码'
          value={data.email} onChange={email => setData({ email })}
          error={error.email?.[0]} />
        <Input
          error={error.code?.[0]}
          request={sendSmsCode}
          label='验证码' type="sms_code" placeholder='六位数字' value={data.code}
          onChange={value => setData({ code: value })}
        />
        <div mt-100px>
          <button j-btn type="submit" >登录</button>
        </div>
      </form>
    </>
  )
}


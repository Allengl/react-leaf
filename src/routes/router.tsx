import { Outlet, createBrowserRouter } from 'react-router-dom'
import { preload } from 'swr'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { Root } from '../components/Root'
import { WelcomeLayout } from '../layouts/WelcomeLayout'
import { ItemsPage } from '../pages/ItemsPage'
import { ItemsNewPage } from '../pages/ItemsNewPage'
import { Welcome1 } from '../pages/Welcome1'
import { Welcome2 } from '../pages/Welcome2'
import { Welcome3 } from '../pages/Welcome3'
import { Welcome4 } from '../pages/Welcome4'
import { Home } from '../pages/Home'
import { SignInPage } from '../pages/SignInPage'
import { TagsNewPage } from '../pages/TagsNewPage'
import { TagsEditPage } from '../pages/TagsEditPage'
import { StatisticsPage } from '../pages/StatisticsPage'
import { ItemsPageError } from '../pages/ItemsPageError'
import { ErrorEmptyData, ErrorUnauthorized } from '../errors'
import { ErrorPage } from '../pages/ErrorPage'
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />
  },
  {
    path: '/home',
    element: <Home title="首页" />,
  },
  {
    path: '/welcome',
    element: <WelcomeLayout />,
    children: [
      { path: '1', element: <Welcome1 /> },
      { path: '2', element: <Welcome2 /> },
      { path: '3', element: <Welcome3 /> },
      { path: '4', element: <Welcome4 /> },
    ],
  },
  { path: '/sign_in', element: <SignInPage /> },
  {
    // 放在这里的路由全部都需要登录
    path: '/',
    element: <Outlet />,
    errorElement: <ErrorPage />,
    loader: async () =>
      preload('/api/v1/me', (path) => axios.get<Resource<User>>(path)
        .then(r => r.data, e => { throw new ErrorUnauthorized })),
    children: [
      {
        path: '/items',
        element: <ItemsPage />,
        errorElement: <ItemsPageError />,
        loader: async () => {
          const onError = (error: AxiosError) => {
            if (error.response?.status === 401) { throw new ErrorUnauthorized() }
            throw error
          }
          return preload('/api/v1/items?page=1', async (path) => {
            const response = await axios.get<Resources<Item>>(path).catch(onError)
            if (response.data.resources.length > 0) {
              return response.data
            } else {
              throw new ErrorEmptyData()
            }
          })
        }
      },
      {
        path: '/items/new',
        element: <ItemsNewPage />,
      },
      { path: '/tags', element: <div>标签</div> },
      { path: '/tags/new', element: <TagsNewPage /> },
      { path: '/tags/:id', element: <TagsEditPage /> },
      { path: '/statistics', element: <StatisticsPage /> },
      { path: '/export', element: <div>敬请期待</div> },
      { path: '/noty', element: <div>敬请期待</div> },
    ]
  },
])

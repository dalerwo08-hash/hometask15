import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Catalog from './component/Catalog'
import Reset from './component/Reset'
import Layout from './component/Layout'

const App = () => {
    let router = createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: <Catalog />
                },
                {
                    path: '/about',
                    element: <Reset />
                }
            ]
        }

    ]

    )

    return (
        <RouterProvider router={router} />
    )
}

export default App
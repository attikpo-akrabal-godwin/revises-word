import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './pages/Revise.tsx'
import Index from './pages/index.tsx'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import DictionaryPage from './pages/Dictionary.tsx'
import Match from './pages/MatchMeaning.tsx'
import WordSentences from './pages/WordSentences.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/revise",
    element: <App />,
  },
  {
    path: "/match",
    element: <Match />,
  },
  {
    path: "/dictionary",
    element: <DictionaryPage />,
  },
  {
    path: "/sentences",
    element: <WordSentences />,
  }
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />,
  </StrictMode>,
)

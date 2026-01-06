const React = require('react');

const BrowserRouter = ({ children }) => children;
const MemoryRouter = ({ children }) => children;
const Link = ({ children, to, ...props }) => React.createElement('a', { href: to, ...props }, children);
const Routes = ({ children }) => React.createElement(React.Fragment, null, children);
const Route = ({ element }) => element || null;
const useLocation = () => ({ pathname: '/' });
const useNavigate = () => () => {};
const useParams = () => ({});

module.exports = {
  __esModule: true,
  BrowserRouter,
  MemoryRouter,
  Link,
  Routes,
  Route,
  useLocation,
  useNavigate
};
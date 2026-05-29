export const useNavigate = () => () => undefined;
export const useLocation = () => ({ pathname: '/', search: '', hash: '', state: null });
export const useParams = () => ({});
export const Link = ({ children }: { children: unknown }) => children;
export const NavLink = ({ children }: { children: unknown }) => children;
export const Navigate = () => null;
export const Outlet = () => null;
export const MemoryRouter = ({ children }: { children: unknown }) => children;

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Sun, Moon, LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/DropdownMenu';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 backdrop-blur-sm px-4 md:px-6 lg:px-8">
      <div className="hidden lg:block">
        <h1 className="text-lg font-medium text-foreground">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
      </div>

      <div className="flex items-center gap-2 ml-auto lg:ml-0">
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User size={16} className="text-primary" />
            </div>
            <span className="hidden md:inline text-sm font-medium">
              {user?.name}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut size={14} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;

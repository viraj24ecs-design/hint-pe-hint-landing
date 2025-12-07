import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import hintpehintlogo2 from "@/assets/HintPeHintHorizontal.png";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <img 
              src={hintpehintlogo2} 
              alt="Hint Pe Hint Logo" 
              className="h-60 lg:h-70 w-auto mt-6"
            />

            {/* Navigation */}
            <nav className="flex items-center gap-2 lg:gap-4">
              {!isLoggedIn ? (
                <>
                  <Button 
                    variant="nav" 
                    size="default" 
                    className="hidden sm:inline-flex"
                    onClick={() => setShowLoginModal(true)}
                  >
                    Log in
                  </Button>
                  <Button 
                    variant="navFilled" 
                    size="default"
                    onClick={() => setShowSignupModal(true)}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="nav" 
                    size="default" 
                    className="hidden sm:inline-flex"
                    onClick={logout}
                  >
                    Log out
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full"
                    onClick={() => setShowProfileModal(true)}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      {showSignupModal && <SignupModal onClose={() => setShowSignupModal(false)} />}
      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
    </>
  );
};

// Login Modal Component
const LoginModal = ({ onClose }: { onClose: () => void }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(username, password);
    
    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-background p-8 rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md bg-background"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md bg-background"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Signup Modal Component
const SignupModal = ({ onClose }: { onClose: () => void }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signup(formData);
    
    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || "Signup failed");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 overflow-y-auto" onClick={onClose}>
      <div className="bg-background p-8 rounded-lg shadow-xl max-w-md w-full mx-4 my-8" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Username *</label>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md bg-background"
              placeholder="Choose a unique username"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Full Name *</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md bg-background"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Email *</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md bg-background"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Date of Birth *</label>
            <input 
              type="date" 
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md bg-background"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Password * (min 6 characters)</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md bg-background"
              placeholder="Create a password"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Confirm Password *</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md bg-background"
              placeholder="Confirm your password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Profile Modal Component
const ProfileModal = ({ onClose }: { onClose: () => void }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-background p-8 rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6">User Profile</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="text-lg font-semibold">{user.userId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Username</p>
            <p className="text-lg font-semibold">{user.username}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="text-lg font-semibold">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-lg font-semibold">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date of Birth</p>
            <p className="text-lg font-semibold">{new Date(user.dateOfBirth).toLocaleDateString()}</p>
          </div>
        </div>
        <Button className="w-full mt-6" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

export default Header;

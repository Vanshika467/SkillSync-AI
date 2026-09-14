import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService.js";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import Input from "../components/Input.jsx";

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await loginUser(formData);
            login(result.data.user, result.data.accessToken);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-950 flex items-center justify-center px-4 animate-fade-in-up">
                <Card className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-white mb-2 text-center">
                    Welcome Back
                </h1>
                <p className="text-gray-400 text-sm text-center mb-6">
                    Login to SkillSync AI
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-2.5 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                    />

                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                    />

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>

                <p className="text-gray-400 text-sm text-center mt-5">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium">
                        Register
                    </Link>
                </p>
            </Card>
        </div>
    );
}

export default LoginPage;
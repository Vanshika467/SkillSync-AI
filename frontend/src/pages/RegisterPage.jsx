import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService.js";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import Input from "../components/Input.jsx";

function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        fullName: "",
        password: "",
    });

    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAvatarChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    const handleCoverImageChange = (e) => {
        setCoverImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!avatar) {
            setError("Avatar image is required");
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            data.append("username", formData.username);
            data.append("email", formData.email);
            data.append("fullName", formData.fullName);
            data.append("password", formData.password);
            data.append("avatar", avatar);

            if (coverImage) {
                data.append("coverImage", coverImage);
            }

            await registerUser(data);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-950 flex items-center justify-center px-4 py-8 animate-fade-in-up">
            <Card className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-white mb-2 text-center">
                    Create Account
                </h1>
                <p className="text-gray-400 text-sm text-center mb-6">
                    Join SkillSync AI today
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-2.5 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        autoComplete="username"
                        required
                    />

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
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        autoComplete="name"
                        required
                    />

                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                    />

                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">
                            Avatar (required)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="w-full text-gray-300 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:text-sm hover:file:bg-purple-500"
                        />
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">
                            Cover Image (optional)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImageChange}
                            className="w-full text-gray-300 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-gray-700 file:text-white file:text-sm hover:file:bg-gray-600"
                        />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Registering..." : "Register"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}

export default RegisterPage;
import React, { useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import { toast, ToastContainer } from 'react-toastify';
import { loginAPI, registerAPI } from '../services/apiAll';




const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [userData, setUserData] = useState({ name: '', email: '', password: '', role: 'candidate' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });


    };
    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = userData;

        if (!email || !password) {
            return toast.info("Please fill in all fields");
        }

        try {
            const result = await loginAPI(userData);

            if (result.status === 200) {
                const { name, role } = result.data.user;
                const token = result.data.token;

                sessionStorage.setItem("name", name);
                sessionStorage.setItem("token", token);
                sessionStorage.setItem("role", role);

                toast.success("User logged in");

                if (role === "admin") {
                    toast.info("Welcome Admin");
                    navigate('/admin-dashboard');
                } else {
                    navigate('/dashboard');
                }

                setUserData({ email: "", password: "" });

            } else {
                toast.warning(result.response?.data?.message || "Login failed");
            }

        }
        catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                toast.warning(err.response.data.message);  // backend sends { message: "..." }
            } else {
                console.error("Login error:", err);
                toast.error("Something went wrong. Try again.");
            }

        }

    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const { name, email, password, role } = userData;

        if (!name || !email || !password || !role) {
            return toast.warning("Please fill in all fields");
        } else {

            try {
                // proceed to API call


                const result = await registerAPI(userData);


                if (result.status === 201) {
                    toast.success(`${result.data.name} has successfully registered`);
                    setIsLogin(true);
                    setUserData({ name: "", email: "", password: "", role: "" });

                }
            } catch (err) {
                if (err.response && err.response.data && err.response.data.message) {
                    toast.warning(err.response.data.message);  // backend sends { message: "..." }
                } else {

                    toast.error("Registration failed. Please try again.");
                }
            }

        }
    };


    return (
        <>
            <Header />
            <div className="container mt-5">
                <h2 className="mb-4 text-center">{isLogin ? 'Login' : 'Register'}</h2>

                <form onSubmit={isLogin ? handleLogin : handleRegister}
                    className="row g-3 justify-content-center">
                    {!isLogin && (
                        <>
                            <div className="col-md-6">
                                <input type="text" className="form-control" name="name" placeholder="Name" onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <select className="form-select" name="role" onChange={handleChange} defaultValue="candidate">
                                    <option value="candidate">Candidate</option>
                                    <option value="employer">Employer</option>
                                </select>
                            </div>
                        </>
                    )}

                    <div className="col-md-6">
                        <input type="email" value={userData.email} className="form-control" name="email" placeholder="Email" onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <input type="password" value={userData.password} className="form-control" name="password" placeholder="Password" onChange={handleChange} required />
                    </div>

                    <div className="col-md-6">
                        <button type="submit" className="btn btn-primary w-100">
                            {isLogin ? 'Login' : 'Register'}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-3">
                    {isLogin ? (
                        <p>
                            Don't have an account?{' '}
                            <button className="btn btn-link p-0" onClick={() => setIsLogin(false)}>Register here</button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{' '}
                            <button className="btn btn-link p-0" onClick={() => setIsLogin(true)}>Login here</button>
                        </p>
                    )}
                </div>
                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"

                />
            </div>
        </>
    );
};

export default Auth;

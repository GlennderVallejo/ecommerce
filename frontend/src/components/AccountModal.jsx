import { useState } from "react";
import { loginUser, registerUser } from "../services/api";

const EMAIL_PATTERN =
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

function AccountModal( { onClose, onLogin }) {
    const [mode, setMode] = useState("login");

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const isRegister = mode === "register";

    const handleChange = (event) => {
        const {name, value} = event.target;

        setForm((current) => ({
                ...current,
                [name]: value,
            }));

        setFieldErrors((current) => ({
                ...current,
                [name]: "",
            }));

        setServerError("");
    };

    const validateForm = () => {
        const errors = {};
        const email = form.email.trim();

        if (isRegister && !form.name.trim()) {
            errors.name = "Please enter your name.";
        }

        if (!email) {
            errors.email = "Please enter your email address.";
        } else if (!EMAIL_PATTERN.test(email)) {
            errors.email =
                    "Enter a valid email address, e.g. name@example.com.";
        }

        if (!form.password) {
            errors.password = "Please enter your password.";
        } else if (form.password.length < 8) {
            errors.password =
                    "Password must be at least 8 characters long.";
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setServerError("");

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            if (isRegister) {
                await registerUser({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    password: form.password,
                });
            }

            const response = await loginUser({
                email: form.email.trim(),
                password: form.password,
            });

            localStorage.setItem(
                    "pardrit_token",
                    response.token
                    );

            onLogin();
            onClose();
        } catch (error) {
            setServerError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setMode((current) =>
            current === "login" ? "register" : "login"
        );

        setForm({
            name: "",
            email: "",
            password: "",
        });

        setFieldErrors({});
        setServerError("");
    };

    return (
            <div
                className="overlay"
                onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            onClose();
                        }
                    }}
                >
                <section className="account-panel">
                    <div className="panel-top">
                        <span>
                            / ACCOUNT —{" "}
                            {isRegister
                                        ? "CREATE ACCOUNT"
                                        : "SIGN IN"}
                        </span>
            
                        <button
                            type="button"
                            onClick={onClose}
                            >
                            CLOSE ×
                        </button>
                    </div>
            
                    <div className="account-heading">
                        <p>PARDRIT / MEMBER ACCESS</p>
            
                        <h2>
                            {isRegister
                                        ? "JOIN PARDRIT."
                                        : "WELCOME BACK."}
                        </h2>
                    </div>
            
                    <form
                        className="account-form"
                        onSubmit={handleSubmit}
                        noValidate
                        >
                        {isRegister && (
                                    <label>
                                        NAME
                        
                                        <input
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            autoComplete="name"
                                            aria-invalid={
                                                            Boolean(fieldErrors.name)
                                            }
                                            />
                        
                                        {fieldErrors.name && (
                                                                <span className="field-error">
                                                                    {fieldErrors.name}
                                                                </span>
                                                                )}
                                    </label>
                                            )}
            
                        <label>
                            EMAIL
            
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                                aria-invalid={
                                    Boolean(fieldErrors.email)
                                }
                                />
            
                            {fieldErrors.email && (
                            <span className="field-error">
                                {fieldErrors.email}
                            </span>
                                        )}
                        </label>
            
                        <label>
                            PASSWORD
            
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete={
                                    isRegister
                                            ? "new-password"
                                            : "current-password"
                                }
                                aria-invalid={
                                    Boolean(fieldErrors.password)
                                }
                                />
            
                            {isRegister &&
                                        !fieldErrors.password && (
                                    <span className="field-hint">
                                        Use at least 8 characters.
                                    </span>
                                                )}
            
                            {fieldErrors.password && (
                            <span className="field-error">
                                {fieldErrors.password}
                            </span>
                                        )}
                        </label>
            
                        {serverError && (
                            <p className="form-error">
                                {serverError}
                            </p>
                                    )}
            
                        <button
                            className="account-submit"
                            type="submit"
                            disabled={loading}
                            >
                            {loading
                                        ? "PROCESSING..."
                                        : isRegister
                                        ? "CREATE ACCOUNT ↗"
                                        : "SIGN IN ↗"}
                        </button>
                    </form>
            
                    <button
                        type="button"
                        className="account-switch"
                        onClick={switchMode}
                        >
                        {isRegister
                                    ? "ALREADY A MEMBER? SIGN IN"
                                    : "NO ACCOUNT? CREATE ONE"}
                    </button>
                </section>
            </div>
            );
}

export default AccountModal;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Credenciais de teste
    const testCredentials = {
        email: 'admin@teste.com',
        password: '123456'
    };

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validação simples
        if (credentials.email === testCredentials.email && 
            credentials.password === testCredentials.password) {
            // Login bem-sucedido
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/');
        } else {
            setError('Email ou senha incorretos. Use: admin@teste.com / 123456');
        }
    };

    return (
        <div className="container-fluid vh-100 bg-light">
            <div className="row justify-content-center align-items-center h-100">
                <div className="col-md-4 col-sm-8">
                    <div className="card shadow">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <h2 className="card-title text-primary">PetShop Admin</h2>
                                <p className="text-muted">Faça login para acessar o sistema</p>
                            </div>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={credentials.email}
                                        onChange={handleChange}
                                        placeholder="Digite seu email"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label">
                                        Senha
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        placeholder="Digite sua senha"
                                        required
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100 py-2"
                                >
                                    Entrar
                                </button>
                            </form>

                            <div className="mt-4 p-3 bg-light rounded">
                                <small className="text-muted">
                                    <strong>Credenciais de teste:</strong><br />
                                    Email: admin@teste.com<br />
                                    Senha: 123456
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
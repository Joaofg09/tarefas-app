import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setErro('')
    try {
      const { data } = await api.post('/auth/login', { email, senha })
      localStorage.setItem('token', data.token)
      navigate('/tarefas')
    } catch {
      setErro('Email ou senha inválidos')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.titulo}>Entrar</h1>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
          />
          {erro && <p style={styles.erro}>{erro}</p>}
          <button style={styles.botao} type="submit">Entrar</button>
        </form>
        <p style={styles.link}>
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f' },
  card: { background: '#1a1a1a', padding: '2rem', borderRadius: '16px', border: '1px solid #2a2a2a', width: '100%', maxWidth: '360px' },
  titulo: { fontSize: '24px', fontWeight: '600', marginBottom: '1.5rem', color: '#f0f0f0' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #2a2a2a', fontSize: '14px', outline: 'none', background: '#111', color: '#e0e0e0' },
  botao: { padding: '10px', borderRadius: '8px', background: '#7c6af7', color: '#fff', border: 'none', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginTop: '4px' },
  erro: { color: '#f87171', fontSize: '13px', margin: '0' },
  link: { textAlign: 'center', marginTop: '1rem', fontSize: '13px', color: '#666' }
}
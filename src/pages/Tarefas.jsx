import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Tarefas() {
  const [tarefas, setTarefas] = useState([])
  const [nome, setNome] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/')
      return
    }
    buscarTarefas()
  }, [])

  async function buscarTarefas() {
    try {
      const { data } = await api.get('/tarefas')
      setTarefas(data)
    } catch {
      navigate('/')
    }
  }

  async function criarTarefa(e) {
    e.preventDefault()
    if (!nome.trim()) return
    try {
      const { data } = await api.post('/tarefas', { nome })
      setTarefas([...tarefas, data])
      setNome('')
    } catch {
      setErro('Erro ao criar tarefa')
    }
  }

  async function toggleFeita(tarefa) {
    try {
      const { data } = await api.put(`/tarefas/${tarefa.id}`, {
        feita: !tarefa.feita
      })
      setTarefas(tarefas.map(t => t.id === tarefa.id ? data : t))
    } catch {
      setErro('Erro ao atualizar tarefa')
    }
  }

  async function deletarTarefa(id) {
    try {
      await api.delete(`/tarefas/${id}`)
      setTarefas(tarefas.filter(t => t.id !== id))
    } catch {
      setErro('Erro ao deletar tarefa')
    }
  }

  function sair() {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.titulo}>Minhas tarefas</h1>
          <button onClick={sair} style={styles.botaoSair}>Sair</button>
        </div>

        <form onSubmit={criarTarefa} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Nova tarefa..."
            value={nome}
            onChange={e => setNome(e.target.value)}
          />
          <button style={styles.botaoAdicionar} type="submit">Adicionar</button>
        </form>

        {erro && <p style={styles.erro}>{erro}</p>}

        <ul style={styles.lista}>
          {tarefas.length === 0 && (
            <p style={styles.vazio}>Nenhuma tarefa ainda. Crie uma acima!</p>
          )}
          {tarefas.map(tarefa => (
            <li key={tarefa.id} style={styles.item}>
              <input
                type="checkbox"
                checked={tarefa.feita}
                onChange={() => toggleFeita(tarefa)}
                style={styles.checkbox}
              />
              <span style={{
                ...styles.nomeTarefa,
                textDecoration: tarefa.feita ? 'line-through' : 'none',
                color: tarefa.feita ? '#999' : '#1a1a1a'
              }}>
                {tarefa.nome}
              </span>
              <button
                onClick={() => deletarTarefa(tarefa.id)}
                style={styles.botaoDeletar}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <p style={styles.contagem}>
          {tarefas.filter(t => t.feita).length} de {tarefas.length} concluídas
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f', padding: '1rem' },
  card: { background: '#1a1a1a', padding: '2rem', borderRadius: '16px', border: '1px solid #2a2a2a', width: '100%', maxWidth: '480px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  titulo: { fontSize: '24px', fontWeight: '600', color: '#f0f0f0', margin: 0 },
  botaoSair: { padding: '6px 12px', borderRadius: '8px', border: '1px solid #2a2a2a', background: 'transparent', fontSize: '13px', cursor: 'pointer', color: '#888' },
  form: { display: 'flex', gap: '8px', marginBottom: '1rem' },
  input: { flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #2a2a2a', fontSize: '14px', outline: 'none', background: '#111', color: '#e0e0e0' },
  botaoAdicionar: { padding: '10px 16px', borderRadius: '8px', background: '#7c6af7', color: '#fff', border: 'none', fontSize: '14px', fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap' },
  lista: { listStyle: 'none', padding: 0, margin: '0 0 1rem' },
  item: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 0', borderBottom: '1px solid #222' },
  checkbox: { width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0, accentColor: '#7c6af7' },
  nomeTarefa: { flex: 1, fontSize: '14px', color: '#e0e0e0' },
  botaoDeletar: { background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: '14px', padding: '2px 6px', borderRadius: '4px' },
  erro: { color: '#f87171', fontSize: '13px' },
  vazio: { color: '#555', fontSize: '14px', textAlign: 'center', padding: '1.5rem 0' },
  contagem: { fontSize: '12px', color: '#555', textAlign: 'right', margin: 0 }
}
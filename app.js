const express = require('express');
const bcrypt = require('bcrypt');
const connection = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

//Rota pública
app.get('/', (req, res) => {
    res.status(200).json({msg: "Bem vindo a nossa API!"})
})

app.post('/aluno', async (req, res) => {
  const {
    id_aluno,
    nome_completo,
    usuario_acesso,
    senha,
    email_aluno,
    observacao,
    data_cadastro,
  } = req.body;

  if (!id_aluno || !nome_completo || !usuario_acesso || !senha || !email_aluno) {
    return res.status(400).json({ mensagem: 'Campos obrigatórios faltando.' });
  }

  try {
    const senha_hash = await bcrypt.hash(senha, 10);

    const sql = `
      INSERT INTO alunos (
        id_aluno, nome_completo, usuario_acesso, senha_hash, email_aluno, observacao, data_cadastro
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      id_aluno,
      nome_completo,
      usuario_acesso,
      senha_hash,
      email_aluno,
      observacao || null,
      data_cadastro || new Date(),
    ];

    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error('Erro ao inserir aluno:', err);
        return res.status(500).json({ mensagem: 'Erro ao inserir aluno no banco de dados.' });
      }

      res.status(201).json({ mensagem: 'Aluno cadastrado com sucesso!' });
    });
  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

-- criar banco de dados
create database controle_financeiro;


-- criar tabela usuarios
create table usuarios (
  id serial primary key,
  nome text not null,
  email text not null unique,
  senha text not null
);


-- criar tabela categorias
create table categorias (
  id serial primary key,
	descricao text
);


-- criar tabela transacoes
create table transacoes(
  id serial primary key,
	descricao text not null,
  valor numeric not null,
  data date DEFAULT CURRENT_DATE,
  categoria_id integer references categorias(id),
  usuario_id integer references usuarios(id),
  tipo text not null
);

create table saldo (
  id SERIAL PRIMARY KEY,
  saldo DECIMAL NOT NULL,
  data_atualizacao TIMESTAMP default now(),
  usuario_id INTEGER NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);


-- inserir dados na tabela categorias
insert into categorias (descricao) values
    ('Alimentação'),
    ('Assinaturas e Serviços'),
    ('Casa'),
    ('Mercado'),
    ('Cuidados Pessoais'),
    ('Educação'),
    ('Família'),
    ('Lazer'),
    ('Pets'),
    ('Presentes'),
    ('Roupas'),
    ('Saúde'),
    ('Transporte'),
    ('Salário'),
    ('Vendas'),
    ('Outras receitas'),
    ('Outras despesas');
-- criar banco de dados
create database dindin_teste;


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
  data date not null,
  categoria_id integer references categorias(id),
  usuario_id integer references usuarios(id),
  tipo text not null
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
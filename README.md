# 🛍️ Projeto clothes.com
![GitHub repo size](https://img.shields.io/github/repo-size/walkerviani/projeto-lojaroupas?style=flat-square)
![GitHub language count](https://img.shields.io/github/languages/count/walkerviani/projeto-lojaroupas?style=flat-square)
![NPM License](https://img.shields.io/npm/l/license?style=flat-square)

# 📋 Sobre o projeto
![Página Inicial](https://github.com/walkerviani/assets/blob/main/pagina_inicial.png)
> O **clothes.com** é uma aplicação web de e-commerce de roupas desenvolvida com **Java + Spring Boot** no backend e **HTML, CSS e JavaScript** no frontend.

🌐 **Link de acesso à aplicação:** [project-clothes-com.onrender.com](https://project-clothes-com.onrender.com/)

**Conta de teste disponível:**

| E-mail | Senha |
|--------|-------|
| user@gmail.com | 12345678 |

> Você também pode criar sua própria conta diretamente pela aplicação.

# 🚀 Tecnologias utilizadas

**Backend**
- **Java 21** — Linguagem principal
- **Spring Boot 4.0.2** — Framework principal (Web MVC + Data JPA)
- **Spring Security Crypto (BCrypt)** — Criptografia de senhas de usuários
- **Lombok** — Redução de boilerplate no código
- **PostgreSQL** — Banco de dados
- **Spring Boot DevTools** — Reinício automático da aplicação ao salvar alterações no código
- **Maven** — Gerenciamento de dependências e build

**Frontend**
- **HTML5 + CSS3** — Estrutura e estilização das páginas
- **JavaScript** — Interatividade

# ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Java 21+](https://www.oracle.com/java/technologies/downloads/)
- [PostgreSQL](https://www.postgresql.org/download/) — crie um banco de dados antes de executar
- [Maven 3.8+](https://maven.apache.org/download.cgi)

# 📦 Instalando
1. **Clone o repositório:**
```bash
git clone https://github.com/walkerviani/projeto-lojaroupas.git
cd projeto-lojaroupas
```
2. **Configure o banco de dados PostgreSQL criando um arquivo .env na raiz do projeto com as credenciais do banco:**
```
DATABASE_URL=jdbc:postgresql://localhost:5432/nome_do_banco_de_dados
DATABASE_USERNAME=seu_usuario
DATABASE_PASSWORD=sua_senha
FRONT_URL=http://localhost:8080
```
3. **Execute a aplicação:**

No Linux/macOS:
```bash
./mvnw spring-boot:run
```
No Windows:
```bash
mvnw.cmd spring-boot:run
```
4. **Acesse no navegador:**

```
http://localhost:8080
```
# 📄 Licença

Este projeto está licenciado sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

Desenvolvido por [Walker Yslan Viani](https://github.com/walkerviani)

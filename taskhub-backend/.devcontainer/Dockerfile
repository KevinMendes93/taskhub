FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

# Instala dependências
RUN apt-get update && apt-get install -y curl git build-essential \
    && rm -rf /var/lib/apt/lists/*

# Configura o NVM no usuário vscode
USER vscode
ENV NVM_DIR=/home/vscode/.nvm
RUN mkdir -p $NVM_DIR \
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash \
    && echo 'export NVM_DIR="$HOME/.nvm"' >> /home/vscode/.bashrc \
    && echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> /home/vscode/.bashrc

# Garante que o bash seja usado como shell padrão
SHELL ["/bin/bash", "-i", "-c"]

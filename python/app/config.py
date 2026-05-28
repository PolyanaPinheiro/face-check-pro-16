#------------------------------------------------------------------------------------
""" Este script serve para """
#------------------------------------------------------------------------------------
""" dontenv: Ela serve para carregar variáveis de ambiente (como senhas, chaves de API e URLs) de um arquivo .env seguro para dentro do seu programa."""

import os
from dotenv import load_dotenv 

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://usuario:senha@localhost:5432/facecheckdb")
    PORT: int = int(os.getenv("PORT", 8000))
    # Combinação de duas bibliotecas para lidar com variáveis de ambiente:
    # Pydantic e Dotenv. O Pydantic é usado para definir uma classe de
    # configuração (Settings) que carrega as variáveis de ambiente usando
    # o Dotenv. Isso permite que você tenha uma configuração centralizada e
    # fácil de acessar em todo o seu aplicativo, garantindo que as variáveis
    # sensíveis sejam mantidas fora do código-fonte e possam ser facilmente
    # alteradas sem modificar o código.

settings = Settings()
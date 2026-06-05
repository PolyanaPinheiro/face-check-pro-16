#------------------------------------------------------------------------------------
""" Este script serve para """
#------------------------------------------------------------------------------------
""" dontenv: Ela serve para carregar variáveis de ambiente (como senhas, chaves de API e URLs) de um arquivo .env seguro para dentro do seu programa."""

import os
from dotenv import load_dotenv 

load_dotenv()

class Settings:
   # Mude a linha do DATABASE_URL para ficar assim por padrão:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:1234@localhost:5433/facial")
    PORT: int = int(os.getenv("PORT", 8000))
    # Combinação de duas bibliotecas para lidar com variáveis de ambiente:
    # Pydantic e Dotenv. O Pydantic é usado para definir uma classe de
    # configuração (Settings) que carrega as variáveis de ambiente usando
    # o Dotenv. Isso permite que você tenha uma configuração centralizada e
    # fácil de acessar em todo o seu aplicativo, garantindo que as variáveis
    # sensíveis sejam mantidas fora do código-fonte e possam ser facilmente
    # alteradas sem modificar o código.

settings = Settings()
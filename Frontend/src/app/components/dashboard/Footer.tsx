export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto transition-colors duration-300 py-8">
      <div className="px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#2B5BBA] rounded-xl flex items-center justify-center shadow-md">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 13L6 10L10 14L18 6L21 9"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 20H21"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                PayGrid
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Plataforma completa de gestão de despesas e planejamento
              financeiro inteligente.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Links Úteis</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground cursor-default pointer-events-none"
                >
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground cursor-default pointer-events-none"
                >
                  Termos de Uso
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground cursor-default pointer-events-none"
                >
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Contato</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>contato@paygrid.com.br</li>
              <li>(11) 0000-0000</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          © 2026 PayGrid. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

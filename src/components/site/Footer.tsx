import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-bold text-primary">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">PM</span>
              Péptidos Mayoreo
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Distribuidor mayorista de péptidos en México. Directo de fábrica, sin intermediarios.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Producto</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/productos" className="hover:text-primary">Catálogo</Link></li>
              <li><Link to="/como-funciona" className="hover:text-primary">Cómo funciona</Link></li>
              <li><Link to="/distribuidor" className="hover:text-primary">Distribuidor</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Empresa</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/empezar-negocio" className="hover:text-primary">Empezar negocio</Link></li>
              <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
              <li><Link to="/contacto" className="hover:text-primary">Contacto</Link></li>
              <li><Link to="/preguntas-frecuentes" className="hover:text-primary">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a className="hover:text-primary" href="#">Términos</a></li>
              <li><a className="hover:text-primary" href="#">Privacidad</a></li>
              <li><a className="hover:text-primary" href="#">Política de envíos</a></li>
              <li><a className="hover:text-primary" href="#">Reembolsos</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>
            <strong>Disclaimer:</strong> Productos vendidos exclusivamente para uso de investigación. No aprobados por COFEPRIS para uso humano. Péptidos Mayoreo no proporciona asesoría médica. Consulta a un profesional de la salud.
          </p>
          <p className="mt-3">© {new Date().getFullYear()} Péptidos Mayoreo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "@tanstack/react-router";
import { cities } from "@/data/cities";
import { categories } from "@/data/categories";
import logoFull from "@/assets/peptidos-mayoreo-logo.svg";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <img src={logoFull} alt="Péptidos Mayoreo" className="h-12 w-auto" />
            <p className="mt-3 text-sm text-muted-foreground">
              Distribuidor mayorista de péptidos en México. Mínimo 10 viales, pago Mercado Pago, envío nacional.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Producto</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/productos" className="hover:text-primary">Catálogo de péptidos al mayoreo</Link></li>
              <li><Link to="/como-funciona" className="hover:text-primary">Cómo funciona</Link></li>
              <li><Link to="/distribuidor" className="hover:text-primary">Programa distribuidor</Link></li>
              {categories.slice(0, 4).map((c) => (
                <li key={c.slug}>
                  <Link to="/productos" className="hover:text-primary">{c.name} mayoreo</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Empresa</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/empezar-negocio" className="hover:text-primary">Empezar negocio de péptidos</Link></li>
              <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
              <li><Link to="/resumen-empresa" className="hover:text-primary">Resumen empresa</Link></li>
              <li><Link to="/contacto" className="hover:text-primary">Contacto</Link></li>
              <li><Link to="/preguntas-frecuentes" className="hover:text-primary">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Ciudades</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {cities.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/peptidos/$ciudad"
                    params={{ ciudad: c.slug }}
                    className="hover:text-primary"
                  >
                    Péptidos mayoreo en {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Legal</h4>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <li><a className="hover:text-primary" href="#">Términos</a></li>
              <li><a className="hover:text-primary" href="#">Privacidad</a></li>
              <li><a className="hover:text-primary" href="#">Política de envíos</a></li>
              <li><a className="hover:text-primary" href="#">Reembolsos</a></li>
            </ul>
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

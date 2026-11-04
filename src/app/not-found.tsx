import Link from "next/link";
import Backdrop from "@/components/site/Backdrop";
import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Backdrop />
      <main className="container-site relative z-10 flex min-h-screen flex-col items-start justify-center py-24">
        <p className="eyebrow mb-6">Erreur 404</p>
        <h1 className="display text-[2.6rem] md:text-[4rem]">Cette page n'existe pas, ou plus.</h1>
        <p className="mt-6 max-w-lg text-lg text-fg-muted">
          L'adresse a peut-être changé. Repartez de l'accueil ou parcourez les articles.
        </p>
        <div className="mt-10 flex gap-3">
          <LinkButton href="/">Accueil</LinkButton>
          <LinkButton href="/articles" variant="glass">
            Articles
          </LinkButton>
        </div>
        <Link href="/contact" className="mt-10 text-sm text-fg-dim hover:text-fg-muted">
          Signaler un lien cassé
        </Link>
      </main>
    </>
  );
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/Toaster";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl">404</h1>
        <p className="mt-3 text-muted-foreground">This page can't be found.</p>
        <Link to="/" className="inline-block mt-6 bg-foreground text-background px-6 py-3 rounded-md text-sm">Return Home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-3xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 bg-foreground text-background px-6 py-3 rounded-md text-sm">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "VELDRA — Crafted for the discerning man" },
      { name: "description", content: "Considered menswear. Timeless over trendy. Curated by VELDRA." },
      { property: "og:title", content: "VELDRA — Crafted for the discerning man" },
      { property: "og:description", content: "Considered menswear. Timeless over trendy. Curated by VELDRA." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "VELDRA — Crafted for the discerning man" },
      { name: "twitter:description", content: "Considered menswear. Timeless over trendy. Curated by VELDRA." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e0e5ad76-1d10-496f-9ba6-b78a74e2229c/id-preview-2e94ba0d--2eeccde2-2b7d-4c38-a174-328ec4b3517c.lovable.app-1778348730018.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e0e5ad76-1d10-496f-9ba6-b78a74e2229c/id-preview-2e94ba0d--2eeccde2-2b7d-4c38-a174-328ec4b3517c.lovable.app-1778348730018.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main key={router.state.location.pathname} className="page-transition"><Outlet /></main>
      <Footer />
      <Toaster />
    </QueryClientProvider>
  );
}

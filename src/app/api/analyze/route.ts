import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { url } = await req.json();

  try {
    // 1. Convertir URL de GitHub a URL de API
    // Ejemplo: github.com/facebook/react -> api.github.com/repos/facebook/react
    const repoPath = url.replace('https://github.com/', '').replace(/\/$/, '');
    const apiUrl = `https://api.github.com/repos/${repoPath}`;
    const contentsUrl = `${apiUrl}/contents`;

    // 2. Llamar a la API de GitHub
    const [repoData, contentsData] = await Promise.all([
      fetch(apiUrl).then(res => res.json()),
      fetch(contentsUrl).then(res => res.json())
    ]);

    // 3. Lógica del Scraper Básico: Detectar Stack
    const files = contentsData.map((f: any) => f.name);
    let stack = "Unknown Stack";
    let installCmd = "No install found";

    if (files.includes('package.json')) {
      stack = "Node.js / JavaScript";
      installCmd = "npm install";
      if (files.includes('tsconfig.json')) stack = "TypeScript Project";
    } else if (files.includes('requirements.txt')) {
      stack = "Python Project";
      installCmd = "pip install -r requirements.txt";
    } else if (files.includes('Cargo.toml')) {
      stack = "Rust (Cargo)";
      installCmd = "cargo build";
    }

    return NextResponse.json({
      name: repoData.name,
      stack: stack,
      install: installCmd,
      arch: `GitHub Repo -> ${repoData.language || 'Code'} -> Analysis`,
      summary: repoData.description || "Sin descripción disponible."
    });

  } catch (error) {
    return NextResponse.json({ error: "No pude leer ese repo" }, { status: 500 });
  }
}
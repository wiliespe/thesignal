import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || !url.includes('github.com')) {
      return NextResponse.json({ error: "URL de GitHub no válida" }, { status: 400 });
    }

    const repoPath = url.split('github.com/')[1];
    const apiUrl = `https://api.github.com/repos/${repoPath}`;
    const contentsUrl = `${apiUrl}/contents`;

    const repoRes = await fetch(apiUrl);
    const contentsRes = await fetch(contentsUrl);

    if (!repoRes.ok) throw new Error('Repositorio no encontrado');

    const repoData = await repoRes.json();
    const contentsData = await contentsRes.json();

    // Verificamos que contentsData sea un array antes de usar .map
    const files = Array.isArray(contentsData) ? contentsData.map((f: any) => f.name) : [];
    
    let stack = "Código General";
    let installCmd = "Ver documentación";

    if (files.includes('package.json')) {
      stack = "Node.js / JS";
      installCmd = "npm install";
    } else if (files.includes('requirements.txt')) {
      stack = "Python";
      installCmd = "pip install -r requirements.txt";
    }

    return NextResponse.json({
      name: repoData.name || "Unknown",
      stack: stack,
      install: installCmd,
      arch: `GitHub -> ${repoData.language || 'Code'} -> Signal_`,
      summary: repoData.description || "Sin descripción."
    });

  } catch (error) {
    return NextResponse.json({ error: "Error al analizar el repo" }, { status: 500 });
  }
}
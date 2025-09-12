import { useAuth } from "@/hooks/useAuth";
import React, { useState } from "react";

export default function Sandbox() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string>("");

    const { verifyFace } = useAuth();

    // Quando o usuário escolhe um arquivo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null;
        setFile(selected);

        if (selected) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(selected);
        } else {
            setPreview(null);
        }
    };

    // Enviar para o backend
    const handleUpload = async () => {
        if (!file || !preview) return;

        setLoading(true);
        setResult("");

        try {
            const verified = await verifyFace(preview); // chama sua função
            setResult(verified ? "✅ Face verificada!" : "❌ Não bateu a face");
        } catch (err) {
            console.error(err);
            setResult("Erro ao verificar a face.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 flex flex-col gap-4 max-w-sm">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && <img src={preview} alt="Preview" className="w-full h-auto rounded" />}
            <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
            >
                {loading ? "Enviando..." : "Enviar para verificação"}
            </button>
            {result && <p>{result}</p>}
        </div>
    );
}

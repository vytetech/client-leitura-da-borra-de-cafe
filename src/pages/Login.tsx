import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from '@/providers/trpc'

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  const navigate = useNavigate()
  const utils = trpc.useUtils()
  const adminLogin = trpc.auth.adminLogin.useMutation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await adminLogin.mutateAsync({ username, password })
      await utils.invalidate()
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Usuário ou senha incorretos.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #160f08 0%, #0c0705 100%)' }}>
      <Card className="w-full max-w-sm" style={{ backgroundColor: 'rgba(22,16,9,0.9)', border: '1px solid rgba(201,169,97,0.4)' }}>
        <CardHeader className="text-center">
          <CardTitle style={{ color: '#f2e7d0', fontFamily: "'Cinzel', serif", letterSpacing: '0.12em' }}>Área do Administrador</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuário"
              autoComplete="username"
              style={inputStyle}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              autoComplete="current-password"
              style={inputStyle}
            />
            {error && (
              <p style={{ color: '#e08a8a', fontSize: 13, margin: 0, fontFamily: "'Playfair Display', serif" }}>{error}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={adminLogin.isPending}
              style={{ backgroundColor: '#d4af37', color: '#120b06', fontFamily: "'Cinzel', serif", letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}
            >
              {adminLogin.isPending ? 'Entrando…' : 'Entrar'}
            </Button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 14px' }}>
            <span style={{ flex: 1, height: 1, backgroundColor: 'rgba(201,169,97,0.3)' }} />
            <span style={{ color: 'rgba(201,180,138,0.7)', fontSize: 11, fontFamily: "'Cinzel', serif", letterSpacing: '0.2em' }}>OU</span>
            <span style={{ flex: 1, height: 1, backgroundColor: 'rgba(201,169,97,0.3)' }} />
          </div>

          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => {
              window.location.href = getOAuthUrl();
            }}
            style={{ borderColor: 'rgba(201,169,97,0.4)', color: '#c9a961', fontFamily: "'Cinzel', serif", letterSpacing: '0.1em', fontSize: 12 }}
          >
            Sign in with Kimi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  backgroundColor: 'rgba(12,7,5,0.8)',
  border: '1px solid rgba(201,169,97,0.35)',
  color: '#f2e7d0',
  fontFamily: "'Playfair Display', serif",
  fontSize: 15,
  padding: '12px 14px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}
